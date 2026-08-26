// 개인명 등록/수정
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import AuthorityPersonalForm from "@/components/authority-personal-form-page/authority-personal-form";
import { mapAuthorityDetailToPersonalFormValues } from "@/components/authority-personal-form-page/personal-form.mapper";
import MarcEditor from "@/components/ui/marc-editor";
import { parseLeaderData } from "@/components/ui/marc-editor-context";
import MarcEditorProvider from "@/components/ui/marc-editor-provider";
import MarcFontSizeSelect, {
  defaultFontSize,
} from "@/components/ui/marc-font-size-select";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import type { MarcField } from "@/types/marc-editor.types";

export type AuthorityPersonalFormMode = "create" | "edit";

interface AuthorityPersonalFormPageProps {
  mode: AuthorityPersonalFormMode;
}

export default function AuthorityPersonalFormPage({
  mode,
}: AuthorityPersonalFormPageProps) {
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [editorSessionVersion, setEditorSessionVersion] = useState(0);
  const [searchParams] = useSearchParams();
  const isCreatePage = mode === "create";

  // 등록은 대상 레코드가 없고, 수정은 하나 또는 여러 recKey를 받을 수 있다.
  const recordKeys = isCreatePage
    ? []
    : parseRecordKeys(
        searchParams.get("recKeys") ?? searchParams.get("recKey"),
      );
  const currentRecordKey = isCreatePage
    ? undefined
    : (searchParams.get("current") ?? recordKeys[0]);

  const { data: authorityDetail } = useAuthorityDetail(currentRecordKey ?? "", {
    enabled: !isCreatePage,
  });

  const initialMarcFields = useMemo<MarcField[] | undefined>(() => {
    if (!authorityDetail) {
      return undefined;
    }

    return [
      ...authorityDetail.data.record.control_fields.map((field) => ({
        type: "control" as const,
        tag: field.tag,
        value: field.value,
      })),
      ...authorityDetail.data.record.data_fields.map((field) => ({
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
    setEditorSessionVersion((version) => version + 1);
  };

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
              type={mode}
              showPrevAndNextButtons={!isCreatePage}
              saveButtonText={isCreatePage ? "저장" : "수정"}
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
