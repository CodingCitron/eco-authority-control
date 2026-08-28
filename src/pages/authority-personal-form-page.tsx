// 개인명 등록/수정
import { useEffect, useMemo, useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchAuthorityCreate,
  type AuthorityCreateQueryParams,
} from "@/api/authority-create";
import {
  fetchAuthorityUpdate,
  type AuthorityUpdateQueryParams,
} from "@/api/authority-update";
import { getAuthoritySaveError } from "@/api/authority-save-error";
import AuthorityPersonalForm from "@/components/authority-personal-form-page/authority-personal-form";
import { mapAuthorityDetailToPersonalFormValues } from "@/components/authority-personal-form-page/personal-form.mapper";
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
import type { AuthorityDetailResponse } from "@/api/authority-detail";

export type AuthorityPersonalFormMode = "create" | "edit";

interface AuthorityPersonalFormPageProps {
  mode: AuthorityPersonalFormMode;
}

export default function AuthorityPersonalFormPage({
  mode,
}: AuthorityPersonalFormPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [editorSessionVersion, setEditorSessionVersion] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const isCreatePage = mode === "create";

  // 등록은 대상 레코드가 없고, 수정은 하나 또는 여러 recKey를 받을 수 있다.
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
        throw new Error("수정할 전거 레코드 키가 없습니다.");
      }

      return fetchAuthorityUpdate(
        buildAuthorityUpdateParams(currentRecordKey, saveData),
      );
    },
    onSuccess: async (data: AuthorityDetailResponse) => {
      await queryClient.invalidateQueries({
        queryKey: authoritySearchQueryKeys.all,
      });

      if (currentRecordKey) {
        await queryClient.invalidateQueries({
          queryKey: authorityDetailKeys.detail(currentRecordKey),
        });
      }

      console.log(data);

      // 입력 reckey로 수정 페이지 이동 필요
      if (isCreatePage) {
        const recKey = data.data.recKey;

        // 캐시 업데이트

        // 메시지 표시
        alert("개인명 전거가 생성되었습니다.");

        navigate(
          {
            pathname: "/personal/edit",
            search: `${createSearchParams({
              recKey: recKey,
            })}`,
          },
          {
            replace: true,
          },
        );
      } else {
        // 현재 페이지 유지
        // 캐시 업데이트

        // 메시지 표시
        alert("개인명 전거가 수정되었습니다.");
      }
    },
    onError: (error) => {
      console.log(error);
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

  // 생성 화면은 undefined를 전달해 빈 폼을 사용하고, 수정 화면만 조회값을 매핑한다.
  const initialFormValues = useMemo(
    () =>
      authorityDetail
        ? mapAuthorityDetailToPersonalFormValues(authorityDetail.data)
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
            개인명 전거관리 - {isCreatePage ? "입력" : "수정"}
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
            <label htmlFor="fontSizeSelect" className="visually-hidden">
              글자크기
            </label>
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
          <AuthorityPersonalForm initialValues={initialFormValues} />

          <div className="col-lg-5">
            <MarcEditor
              showPrevAndNextButtons={!isCreatePage}
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
  const copyrightBlanketAgreeDate =
    authorityCreateMetadata.copyrightBlanketAgreeDate?.trim();

  return {
    leaderStatus: leaderData.status,
    leaderType: leaderData.type,
    leaderInputLevel: leaderData.encodingLevel,
    acRegionCode: authorityCreateMetadata.acRegionCode ?? "",
    biographyPrivateYn: authorityCreateMetadata.biographyPrivateYn ?? "N",
    copyrightBlanketAgreeYn:
      authorityCreateMetadata.copyrightBlanketAgreeYn ?? "N",
    ...(copyrightBlanketAgreeDate && { copyrightBlanketAgreeDate }),
    record,
  };
}

function buildAuthorityUpdateParams(
  recKey: string,
  { leaderData, authorityCreateMetadata, record }: MarcEditorSaveData,
): AuthorityUpdateQueryParams {
  const copyrightBlanketAgreeDate =
    authorityCreateMetadata.copyrightBlanketAgreeDate?.trim();

  return {
    recKey,
    leaderStatus: leaderData.status,
    leaderType: leaderData.type,
    leaderInputLevel: leaderData.encodingLevel,
    acRegionCode: authorityCreateMetadata.acRegionCode ?? "",
    biographyPrivateYn: authorityCreateMetadata.biographyPrivateYn ?? "N",
    copyrightBlanketAgreeYn:
      authorityCreateMetadata.copyrightBlanketAgreeYn ?? "N",
    ...(copyrightBlanketAgreeDate && { copyrightBlanketAgreeDate }),
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
      ? "개인명 전거를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요."
      : "개인명 전거를 수정하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    details: [],
  };
}
