import {
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { MarcError, parseLine } from "marc-eco";

import { AuthorityFixedFieldEditButton } from "./authority-fixed-field-edit-modal";
import {
  formatLeaderData,
  useMarcEditor,
  type LeaderData,
  type MarcField,
  type SubField,
} from "./marc-editor-context";

interface MarcEditorProps {
  fontSize: string;
}

type EditorMode = "form" | "text";

export default function MarcEditor({ fontSize }: MarcEditorProps) {
  const [mode, setMode] = useState<EditorMode>("form");
  const { leaderData, variableFields, setVariableFields } = useMarcEditor();

  const addVariableField = () => {
    setVariableFields([
      ...variableFields,
      {
        type: "data",
        tag: "",
        indicator1: "",
        indicator2: "",
        subfields: [],
      },
    ]);
  };

  const updateVariableField = (index: number, nextField: MarcField) => {
    setVariableFields(
      sortMarcFields(
        variableFields.map((field, fieldIndex) =>
          fieldIndex === index ? nextField : field,
        ),
      ),
    );
  };

  const removeVariableField = (index: number) => {
    setVariableFields(
      variableFields.filter((_, fieldIndex) => fieldIndex !== index),
    );
  };

  const handleSave = () => {
    const record = buildMarcRecord(leaderData, variableFields);
    console.log("MARC 레코드 최종 데이터", record);
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
        <span>MARC 레코드 뷰</span>
        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode((previousMode) =>
                previousMode === "form" ? "text" : "form",
              );
            }}
          >
            {mode === "form" ? "편집:폼" : "편집:텍스트"}
          </button>
          <AuthorityFixedFieldEditButton />
        </div>
      </div>
      <div className="card-body p-0">
        <div
          className="form-control marc-textarea marc-record-view h-100 border-0 rounded-0 font-monospace bg-light"
          style={{ minHeight: "200px", fontSize }}
        >
          {variableFields.map((field, index) => (
            <MarcRow
              field={field}
              key={`${field.type}-${field.tag}-${index}`}
              mode={mode}
              onChange={(nextField) =>
                updateVariableField(index, nextField)
              }
              onRemove={() => removeVariableField(index)}
            />
          ))}
          <button
            type="button"
            className="marc-line marc-line-data d-flex justify-content-center"
            aria-label="MARC 행 추가"
            onClick={addVariableField}
          >
            <i className="bi bi-plus-circle fs-3"></i>
          </button>
        </div>
      </div>
      <div className="card-footer bg-white d-flex justify-content-between">
        <div>
          <button className="btn btn-outline-secondary">이전</button>{" "}
          <button className="btn btn-outline-secondary">다음</button>{" "}
          <button
            type="button"
            className="btn btn-light-info ms-2"
            data-bs-toggle="modal"
            data-bs-target="#modalMarcSync"
          >
            서지레코드 일관성 작업
          </button>
        </div>
        <div>
          <button className="btn btn-light-warning">중복조사</button>{" "}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
          >
            저장
          </button>{" "}
          <button className="btn btn-secondary">취소</button>
        </div>
      </div>
    </div>
  );
}

interface MarcRowProps {
  field: MarcField;
  mode: EditorMode;
  onChange: (field: MarcField) => void;
  onRemove: () => void;
}

function MarcRow({ field, mode, onChange, onRemove }: MarcRowProps) {
  const skipBlurCommitRef = useRef(false);
  const [formFocusTarget, setFormFocusTarget] = useState<"tag" | "content">(
    "content",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tagDraft, setTagDraft] = useState(field.tag);
  const [contentDraft, setContentDraft] = useState(() =>
    formatFieldContent(field),
  );
  const [textDraft, setTextDraft] = useState(() => formatMarcLine(field));
  const [errorMessage, setErrorMessage] = useState("");

  const beginEditing = () => {
    if (isEditing) {
      return;
    }

    skipBlurCommitRef.current = false;
    // 외부 폼이나 고정길이 모달에서 값이 바뀌었을 수 있으므로 현재값으로 시작한다.
    setTagDraft(field.tag);
    setContentDraft(formatFieldContent(field));
    setTextDraft(formatMarcLine(field));
    setErrorMessage("");
    setIsEditing(true);
  };

  const commitDraft = () => {
    try {
      const line =
        mode === "text" ? textDraft : `=${tagDraft.trim()}  ${contentDraft}`;
      onChange(toEditorField(parseLine(line)));
      setErrorMessage("");
      return true;
    } catch (error) {
      setErrorMessage(getMarcRowErrorMessage(error));
      return false;
    }
  };

  const finishEditing = () => {
    if (commitDraft()) {
      // Enter로 입력이 사라질 때 발생할 수 있는 blur의 중복 반영을 막는다.
      skipBlurCommitRef.current = true;
      setIsEditing(false);
    }
  };

  const cancelEditing = () => {
    // Escape는 현재 draft를 반영하지 않고 표시 상태로 돌아간다.
    skipBlurCommitRef.current = true;
    setErrorMessage("");
    setIsEditing(false);
  };

  const handleRowBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (skipBlurCommitRef.current) {
      skipBlurCommitRef.current = false;
      return;
    }

    const nextTarget = event.relatedTarget;

    // form 모드의 두 입력 사이를 이동할 때는 편집을 끝내지 않는다.
    if (nextTarget && event.currentTarget.contains(nextTarget)) {
      return;
    }

    finishEditing();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      finishEditing();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelEditing();
    }
  };

  const handleRowMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (isEditing || mode === "text") {
      return;
    }

    const target = event.target;
    const clickedTag =
      target instanceof Element && Boolean(target.closest(".marc-tag"));
    setFormFocusTarget(clickedTag ? "tag" : "content");
  };

  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRemove();
  };

  return (
    <div
      className={`marc-line ${
        field.type === "control" ? "marc-line-control" : "marc-line-data"
      } d-flex align-items-center${isEditing ? " marc-line-editing" : ""}`}
      aria-label={`${field.tag || "새 MARC"} 행`}
      onBlur={isEditing ? handleRowBlur : undefined}
      onFocus={beginEditing}
      onMouseDown={handleRowMouseDown}
      tabIndex={0}
    >
      {isEditing ? (
        <div className="marc-row-editor flex-grow-1">
          {mode === "text" ? (
            <input
              type="text"
              className="form-control form-control-sm marc-row-input font-monospace"
              aria-label="MARC 행 텍스트"
              autoFocus
              placeholder="=100  1\\$a김소월"
              value={textDraft}
              onChange={(event) => setTextDraft(event.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          ) : (
            <div className="d-flex align-items-center gap-1">
              <input
                type="text"
                className="form-control form-control-sm marc-row-input marc-row-tag-input font-monospace"
                aria-label="MARC 태그"
                autoFocus={formFocusTarget === "tag"}
                inputMode="numeric"
                maxLength={3}
                placeholder="태그"
                value={tagDraft}
                onChange={(event) => setTagDraft(event.target.value)}
                onKeyDown={handleInputKeyDown}
              />
              <input
                type="text"
                className="form-control form-control-sm marc-row-input font-monospace"
                aria-label="MARC 지시기와 서브필드"
                autoFocus={formFocusTarget === "content"}
                placeholder="1\\$a김소월"
                value={contentDraft}
                onChange={(event) => setContentDraft(event.target.value)}
                onKeyDown={handleInputKeyDown}
              />
            </div>
          )}
          {errorMessage && (
            <div className="small text-danger mt-1" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      ) : (
        <MarcRowValue field={field} />
      )}

      <button
        type="button"
        className="btn btn-sm p-0 ms-auto"
        aria-label={`${field.tag || "새"} 행 삭제`}
        onClick={handleRemove}
        onMouseDown={(event) => event.preventDefault()}
      >
        <i className="bi bi-dash-circle fs-5"></i>
      </button>
    </div>
  );
}

function MarcRowValue({ field }: { field: MarcField }) {
  if (field.type === "control") {
    return (
      <>
        <span className="marc-tag">{field.tag}</span>
        <span style={{ whiteSpace: "pre" }}>{field.value}</span>
        <span className="marc-eof">%</span>
      </>
    );
  }

  return (
    <>
      <span className="marc-tag">{field.tag}</span>
      <span style={{ whiteSpace: "pre" }}>
        {field.indicator1}
        {field.indicator2}
      </span>
      {field.subfields.map((subfield, index) => (
        <span key={`${subfield.code}-${subfield.value}-${index}`}>
          <span className="marc-sf">${subfield.code}</span> {subfield.value}
        </span>
      ))}
      {/* MARC 필드의 끝을 의미하는 화면 표시 */}
      <span className="marc-eof">%</span>
    </>
  );
}

function formatMarcLine(field: MarcField) {
  return `=${field.tag}  ${formatFieldContent(field)}`;
}

function formatFieldContent(field: MarcField) {
  if (field.type === "control") {
    return field.value;
  }

  return `${formatIndicator(field.indicator1)}${formatIndicator(
    field.indicator2,
  )}${formatSubfields(field.subfields)}`;
}

function formatIndicator(indicator: string) {
  return indicator && indicator !== " " ? indicator[0] : "\\";
}

function formatSubfields(subfields: SubField[]) {
  return subfields
    .map((subfield) => `$${subfield.code}${subfield.value}`)
    .join("");
}

function toEditorField(field: ReturnType<typeof parseLine>): MarcField {
  if ("value" in field) {
    return {
      type: "control",
      tag: field.tag,
      value: field.value,
    };
  }

  return {
    type: "data",
    tag: field.tag,
    indicator1: field.ind1,
    indicator2: field.ind2,
    subfields: field.subfields,
  };
}

/** marc-eco의 파싱 오류를 편집 화면에서 이해하기 쉬운 한글로 변환한다. */
function getMarcRowErrorMessage(error: unknown) {
  if (!(error instanceof MarcError)) {
    return "MARC 행 형식이 올바르지 않습니다.";
  }

  switch (error.code) {
    case "INVALID_MNEMONIC_LINE":
      return "MARC 행은 '=태그  데이터' 형식으로 입력해야 합니다.";
    case "MISSING_INDICATORS":
      return "데이터 필드에는 지시기 두 자리가 필요합니다.";
    case "INVALID_SUBFIELD":
      return "지시기 뒤에는 '$a값'과 같은 서브필드 형식으로 입력해야 합니다.";
    case "LEADER_IS_NOT_FIELD":
      return "리더(LDR)는 고정길이편집에서 수정해야 합니다.";
    case "INVALID_TAG":
      return "태그는 숫자 세 자리로 입력해야 합니다.";
    case "UNREPRESENTABLE_TEXT":
      return "MARC 행에는 줄바꿈을 입력할 수 없습니다.";
    default:
      return "MARC 행 형식이 올바르지 않습니다.";
  }
}

/** 수정이 끝난 필드를 태그 순서로 정렬하며 빈 태그는 새 입력을 위해 마지막에 둔다. */
function sortMarcFields(fields: MarcField[]) {
  return [...fields].sort((left, right) => {
    if (!left.tag) {
      return right.tag ? 1 : 0;
    }
    if (!right.tag) {
      return -1;
    }

    return left.tag.localeCompare(right.tag);
  });
}

function buildMarcRecord(
  leaderData: LeaderData,
  fields: MarcField[],
) {
  return {
    leader: formatLeaderData(leaderData),
    control_fields: fields.flatMap((field) =>
      field.type === "control"
        ? [{ tag: field.tag, value: field.value }]
        : [],
    ),
    data_fields: fields.flatMap((field) =>
      field.type === "data"
        ? [
            {
              tag: field.tag,
              ind1: field.indicator1,
              ind2: field.indicator2,
              subfields: field.subfields,
            },
          ]
        : [],
    ),
  };
}
