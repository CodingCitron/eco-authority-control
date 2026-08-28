import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSearchParams, useNavigate, useSearchParams } from "react-router";

import {
  fetchAuthorityCreate,
  type AuthorityCreateQueryParams,
} from "@/api/authority-create";
import type { AuthorityDetailResponse } from "@/api/authority-detail";
import { getAuthoritySaveError } from "@/api/authority-save-error";
import {
  fetchAuthorityUpdate,
  type AuthorityUpdateQueryParams,
} from "@/api/authority-update";
import AuthorityCorporationForm from "@/components/authority-corporation-form-page/authority-corporation-form";
import { mapAuthorityDetailToCorporationFormValues } from "@/components/authority-corporation-form-page/corporation-form.mapper";
import MarcEditor, {
  type MarcEditorSaveData,
} from "@/components/ui/marc-editor";
import {
  formatLeaderData,
  parseLeaderData,
} from "@/components/ui/marc-editor-context";
import MarcEditorProvider from "@/components/ui/marc-editor-provider";
import MarcFontSizeSelect, {
  defaultFontSize,
} from "@/components/ui/marc-font-size-select";
import {
  authorityDetailKeys,
  useAuthorityDetail,
} from "@/hooks/use-authority-detail";
import { authoritySearchQueryKeys } from "@/hooks/use-authority-search";
import type { MarcEditorSaveError, MarcField } from "@/types/marc-editor.types";

export type AuthorityCorporationFormMode = "create" | "edit";

export default function AuthorityCorporationFormPage({
  mode,
}: {
  mode: AuthorityCorporationFormMode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [editorSessionVersion, setEditorSessionVersion] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const isCreatePage = mode === "create";
  const recordKeys = isCreatePage
    ? []
    : parseRecordKeys(
        searchParams.get("recKeys") ?? searchParams.get("recKey"),
      );
  const currentRecordIndex = isCreatePage
    ? 0
    : parseCurrentRecordIndex(searchParams.get("current"), recordKeys.length);
  const currentRecordKey = isCreatePage
    ? undefined
    : recordKeys[currentRecordIndex];

  const moveToRecord = (nextIndex: number) => {
    if (isCreatePage || nextIndex < 0 || nextIndex >= recordKeys.length) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("current", String(nextIndex));
    setSearchParams(nextSearchParams);
  };

  const { data: authorityDetail } = useAuthorityDetail(currentRecordKey ?? "", {
    enabled: !isCreatePage && Boolean(currentRecordKey),
  });

  const saveMutation = useMutation({
    mutationFn: (saveData: MarcEditorSaveData) => {
      if (isCreatePage) {
        return fetchAuthorityCreate(buildAuthorityCreateParams(saveData));
      }

      if (!currentRecordKey) {
        throw new Error("수정할 단체명 전거 레코드 키가 없습니다.");
      }

      return fetchAuthorityUpdate(
        buildAuthorityUpdateParams(currentRecordKey, saveData),
      );
    },
    onSuccess: async (data: AuthorityDetailResponse) => {
      const savedRecordKey = data.data.recKey;

      queryClient.setQueryData(
        authorityDetailKeys.detail(savedRecordKey),
        data,
      );
      await queryClient.invalidateQueries({
        queryKey: authoritySearchQueryKeys.all,
      });

      if (isCreatePage) {
        window.alert("단체명 전거가 생성되었습니다.");
        navigate(
          {
            pathname: "/corporation/edit",
            search: createSearchParams({
              recKey: savedRecordKey,
            }).toString(),
          },
          { replace: true },
        );
        return;
      }

      window.alert("단체명 전거가 수정되었습니다.");
    },
  });
  const resetSaveMutation = saveMutation.reset;

  useEffect(() => {
    resetSaveMutation();
  }, [currentRecordKey, mode, resetSaveMutation]);

  const initialMarcFields = useMemo<MarcField[] | undefined>(() => {
    if (!authorityDetail) {
      return;
    }

    return [
      ...authorityDetail.data.record.controlFields.map((field) => ({
        type: "control" as const,
        tag: field.tag,
        value: field.value,
      })),
      ...authorityDetail.data.record.dataFields.map((field) => ({
        type: "data" as const,
        tag: field.tag,
        indicator1: field.ind1,
        indicator2: field.ind2,
        subfields: field.subfields,
      })),
    ];
  }, [authorityDetail]);

  const initialLeader = useMemo(
    () =>
      authorityDetail
        ? parseLeaderData(authorityDetail.data.record.leader)
        : undefined,
    [authorityDetail],
  );
  const initialFormValues = useMemo(
    () =>
      authorityDetail
        ? mapAuthorityDetailToCorporationFormValues(authorityDetail.data)
        : undefined,
    [authorityDetail],
  );

  const resetEditorSession = () => {
    resetSaveMutation();
    setEditorSessionVersion((version) => version + 1);
  };
  const saveError = saveMutation.isError
    ? (getAuthoritySaveError(saveMutation.error) ??
      getFallbackSaveError(isCreatePage))
    : undefined;

  return (
    <MarcEditorProvider
      initialFields={initialMarcFields}
      initialLeader={initialLeader}
      key={`${authorityDetail ? "record" : "loading"}-${currentRecordKey ?? "create"}-${editorSessionVersion}`}
    >
      <main
        id="main-content"
        className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-4 pb-5 min-vh-100"
      >
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 className="h2 fw-bold">
            단체명 전거관리 - {isCreatePage ? "입력" : "수정"}
          </h1>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm btn-primary">
              서지 목록보기
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={resetEditorSession}
            >
              화면 초기화
            </button>
            <MarcFontSizeSelect
              aria-label="주자료 글자크기"
              value={fontSize}
              onChange={setFontSize}
              className="form-select-sm w-auto"
            />
            <button type="button" className="btn btn-sm btn-outline-dark">
              한자 -{">"} 한글
            </button>
          </div>
        </div>

        <div className="row">
          <AuthorityCorporationForm initialValues={initialFormValues} />

          <div className="col-lg-5">
            <MarcEditor
              showPrevAndNextButtons={!isCreatePage}
              showBibliographicRecordConsistencyButton={!isCreatePage}
              onPrevious={() => moveToRecord(currentRecordIndex - 1)}
              onNext={() => moveToRecord(currentRecordIndex + 1)}
              previousDisabled={
                recordKeys.length <= 1 || currentRecordIndex === 0
              }
              nextDisabled={
                recordKeys.length <= 1 ||
                currentRecordIndex === recordKeys.length - 1
              }
              saveButtonText={isCreatePage ? "저장" : "수정"}
              onSave={saveMutation.mutate}
              isSaving={saveMutation.isPending}
              saveDisabled={!isCreatePage && !authorityDetail}
              saveError={saveError}
              saveErrorKey={saveMutation.submittedAt}
              fontSize={`${fontSize}px`}
            />
          </div>
        </div>
      </main>
    </MarcEditorProvider>
  );
}

function parseRecordKeys(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return [
    ...new Set(
      value
        .split(",")
        .map((key) => key.trim())
        .filter(Boolean),
    ),
  ];
}

function parseCurrentRecordIndex(value: string | null, recordCount: number) {
  if (value === null || !/^\d+$/.test(value)) {
    return 0;
  }

  const index = Number(value);
  return Number.isSafeInteger(index) && index < recordCount ? index : 0;
}

function buildAuthorityCreateParams({
  leaderData,
  authorityCreateMetadata,
  record,
}: MarcEditorSaveData): AuthorityCreateQueryParams {
  return {
    leaderStatus: leaderData.status,
    leaderType: leaderData.type,
    leaderInputLevel: leaderData.encodingLevel,
    acRegionCode: authorityCreateMetadata.acRegionCode ?? "",
    biographyPrivateYn: "N",
    copyrightBlanketAgreeYn: "N",
    record,
  };
}

function buildAuthorityUpdateParams(
  recKey: string,
  { leaderData, authorityCreateMetadata, record }: MarcEditorSaveData,
): AuthorityUpdateQueryParams {
  return {
    recKey,
    leaderStatus: leaderData.status,
    leaderType: leaderData.type,
    leaderInputLevel: leaderData.encodingLevel,
    acRegionCode: authorityCreateMetadata.acRegionCode ?? "",
    biographyPrivateYn: "N",
    copyrightBlanketAgreeYn: "N",
    record: {
      leader: formatLeaderData(leaderData),
      ...record,
    },
  };
}

function getFallbackSaveError(isCreatePage: boolean): MarcEditorSaveError {
  return {
    code: "SAVE_FAILED",
    message: isCreatePage
      ? "단체명 전거를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요."
      : "단체명 전거를 수정하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    details: [],
  };
}
