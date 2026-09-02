import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { kormarcAuthorityRulePack, MarcError, parseLine } from "marc-eco";

import { sortMarcFields } from "@/lib/marc/marc-field.utils";
import { buildMarcRecord } from "@/lib/marc/marc-record.utils";
import type {
  AuthorityCreateMetadata,
  MarcEditorRecord,
  MarcEditorSaveError,
  MarcField,
  SubField,
} from "@/types/marc-editor.types";
import { AuthorityFixedFieldEditButton } from "./authority-fixed-field-edit-modal";
import { useMarcEditor, type LeaderData } from "./marc-editor-context";
import MarcFieldContentGuide from "./marc-field-content-guide";
import MarcTagCombobox from "./marc-tag-combobox";
import { BibliographicRecordConsistencyButton } from "../authority-personal-form-page/bibliographic-record-consistency-modal";

interface MarcEditorProps {
  showPrevAndNextButtons?: boolean;
  showBibliographicRecordConsistencyButton?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  saveButtonText?: string;
  onSave: (data: MarcEditorSaveData) => void;
  isSaving?: boolean;
  saveDisabled?: boolean;
  saveError?: MarcEditorSaveError;
  saveErrorKey?: string | number;
  fontSize: string;
}

export interface MarcEditorSaveData {
  leaderData: LeaderData;
  authorityCreateMetadata: AuthorityCreateMetadata;
  record: MarcEditorRecord;
}

type EditorMode = "form" | "text";

interface MarcEditorWorkspaceProps {
  title?: string;
  saveError?: MarcEditorSaveError;
  saveErrorKey?: string | number;
  fontSize: string;
}

export default function MarcEditor({
  showPrevAndNextButtons,
  showBibliographicRecordConsistencyButton,
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
  saveButtonText = "저장",
  onSave,
  isSaving = false,
  saveDisabled = false,
  saveError,
  saveErrorKey,
  fontSize,
}: MarcEditorProps) {
  const { leaderData, variableFields, authorityCreateMetadata } =
    useMarcEditor();

  const handleSave = () => {
    onSave({
      leaderData,
      authorityCreateMetadata,
      record: buildMarcRecord(variableFields),
    });
  };

  return (
    <div className="card shadow-sm marc-editor-card">
      <MarcEditorWorkspace
        fontSize={fontSize}
        saveError={saveError}
        saveErrorKey={saveErrorKey}
      />
      <div className="card-footer bg-white d-flex justify-content-between">
        <div>
          {showPrevAndNextButtons && (
            <>
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={previousDisabled}
                onClick={onPrevious}
              >
                이전
              </button>{" "}
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={nextDisabled}
                onClick={onNext}
              >
                다음
              </button>{" "}
            </>
          )}
          {showBibliographicRecordConsistencyButton && (
            <BibliographicRecordConsistencyButton />
          )}
        </div>
        <div>
          <button className="btn btn-light-warning">중복조사</button>{" "}
          <button
            type="button"
            className="btn btn-primary"
            disabled={isSaving || saveDisabled}
            onClick={handleSave}
          >
            {isSaving ? `${saveButtonText} 중...` : saveButtonText}
          </button>{" "}
          <button className="btn btn-secondary">취소</button>
        </div>
      </div>
    </div>
  );
}

/** MARC 행 편집과 고정길이 편집 영역만 제공한다. */
export function MarcEditorWorkspace({
  title = "MARC 레코드 뷰",
  saveError,
  saveErrorKey,
  fontSize,
}: MarcEditorWorkspaceProps) {
  const [mode, setMode] = useState<EditorMode>("form");
  const recordScrollRef = useRef<HTMLDivElement>(null);
  const shouldFocusAddedRowRef = useRef(false);
  const { variableFields, setVariableFields } = useMarcEditor();

  const addVariableField = () => {
    shouldFocusAddedRowRef.current = true;
    setVariableFields((currentFields) => [
      ...currentFields,
      {
        type: "data",
        tag: "",
        indicator1: "",
        indicator2: "",
        subfields: [],
      },
    ]);
  };

  useEffect(() => {
    if (!shouldFocusAddedRowRef.current) {
      return;
    }

    shouldFocusAddedRowRef.current = false;
    const animationFrameId = requestAnimationFrame(() => {
      const scrollContainer = recordScrollRef.current;
      if (!scrollContainer) {
        return;
      }

      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      const rows =
        scrollContainer.querySelectorAll<HTMLElement>("[data-marc-row]");
      rows.item(rows.length - 1)?.focus();
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [variableFields.length]);

  const updateVariableField = (index: number, nextField: MarcField) => {
    setVariableFields((currentFields) =>
      sortMarcFields(
        currentFields.map((field, fieldIndex) =>
          fieldIndex === index ? nextField : field,
        ),
      ),
    );
  };

  const removeVariableField = (index: number) => {
    setVariableFields((currentFields) =>
      currentFields.filter((_, fieldIndex) => fieldIndex !== index),
    );
  };

  return (
    <>
      <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
        <span>{title}</span>
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
          ref={recordScrollRef}
          className="form-control marc-textarea marc-record-view marc-editor-scroll h-100 border-0 rounded-0 font-monospace bg-light"
          style={{ minHeight: "200px", fontSize }}
        >
          {variableFields.map((field, index) => (
            <MarcRow
              field={field}
              key={`${field.type}-${field.tag}-${index}`}
              mode={mode}
              usedTags={variableFields
                .filter((_, fieldIndex) => fieldIndex !== index)
                .map((otherField) => otherField.tag)}
              onChange={(nextField) => updateVariableField(index, nextField)}
              onRemove={() => removeVariableField(index)}
            />
          ))}
        </div>
      </div>
      {saveError ? (
        <MarcEditorToolbarWithError
          key={saveErrorKey}
          error={saveError}
          onAddRow={addVariableField}
        />
      ) : (
        <MarcEditorToolbar onAddRow={addVariableField} />
      )}
    </>
  );
}

function MarcEditorToolbarWithError({
  error,
  onAddRow,
}: {
  error: MarcEditorSaveError;
  onAddRow: () => void;
}) {
  const [isMessageOpen, setIsMessageOpen] = useState(true);
  const messageCount = error.details.length || 1;

  return (
    <>
      {isMessageOpen && (
        <div className="border-top bg-white p-2">
          <div
            // alert alert-danger
            className="text-start mb-0 py-2 px-3"
            role="alert"
          >
            <div className="d-flex align-items-start justify-content-between gap-2">
              <div>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <strong>{error.message}</strong>
                  <code className="text-danger-emphasis">{error.code}</code>
                </div>
                {error.details.length > 0 && (
                  <ul className="small mb-0 mt-2 ps-0">
                    {error.details.map((detail, index) => (
                      <li key={`${detail.code}-${detail.path ?? ""}-${index}`}>
                        {detail.tag && (
                          <span className="badge text-bg-danger me-1">
                            {detail.tag}
                          </span>
                        )}
                        <code className="me-1">{detail.code}</code>
                        <span>{detail.message}</span>
                        {detail.actual !== undefined && (
                          <span>
                            {" "}
                            (actual:{" "}
                            <code>{formatActualValue(detail.actual)}</code>)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                className="btn-close flex-shrink-0"
                aria-label="오류 메시지 닫기"
                onClick={() => setIsMessageOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
      <MarcEditorToolbar
        messageCount={messageCount}
        isMessageOpen={isMessageOpen}
        onToggleMessage={() => setIsMessageOpen((isOpen) => !isOpen)}
        onAddRow={onAddRow}
      />
    </>
  );
}

function MarcEditorToolbar({
  messageCount = 0,
  isMessageOpen = false,
  onToggleMessage,
  onAddRow,
}: {
  messageCount?: number;
  isMessageOpen?: boolean;
  onToggleMessage?: () => void;
  onAddRow: () => void;
}) {
  const hasMessages = messageCount > 0;

  return (
    <div className="marc-editor-add-toolbar border-top bg-white p-2 px-3 d-flex justify-content-between align-items-center">
      <button
        type="button"
        className={`btn btn-sm ${
          hasMessages ? "btn-outline-danger" : "btn-outline-secondary"
        }`}
        aria-expanded={hasMessages ? isMessageOpen : undefined}
        aria-label={hasMessages ? `메시지 ${messageCount}건` : "메시지 없음"}
        disabled={!hasMessages}
        onClick={onToggleMessage}
      >
        메시지 ({messageCount})
      </button>
      <button
        type="button"
        className="btn btn-sm btn-outline-primary"
        aria-label="MARC 행 추가"
        onClick={onAddRow}
      >
        <i className="bi bi-plus-circle me-1" aria-hidden="true" />행 추가
      </button>
    </div>
  );
}

function formatActualValue(value: unknown) {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

interface MarcRowProps {
  field: MarcField;
  mode: EditorMode;
  usedTags: readonly string[];
  onChange: (field: MarcField) => void;
  onRemove: () => void;
}

function MarcRow({
  field,
  mode,
  usedTags,
  onChange,
  onRemove,
}: MarcRowProps) {
  const skipBlurCommitRef = useRef(false);
  const contentInputRef = useRef<HTMLInputElement>(null);
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
    if (!field.tag) {
      setFormFocusTarget("tag");
    }
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
      data-marc-row
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
              <MarcTagCombobox
                autoFocus={formFocusTarget === "tag"}
                value={tagDraft}
                usedTags={usedTags}
                onChange={setTagDraft}
                onSelect={(selectedTag) => {
                  setFormFocusTarget("content");
                  if (
                    kormarcAuthorityRulePack.controlFields[selectedTag] &&
                    contentDraft === "\\\\"
                  ) {
                    setContentDraft("");
                  }
                  contentInputRef.current?.focus();
                }}
                onKeyDown={handleInputKeyDown}
              />
              <MarcFieldContentGuide
                key={tagDraft.trim()}
                inputRef={contentInputRef}
                tag={tagDraft.trim()}
                value={contentDraft}
                autoFocus={formFocusTarget === "content"}
                onChange={setContentDraft}
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
      <div className="d-flex gap-2">
        {field.subfields.map((subfield, index) => (
          <span
            className="d-flex"
            key={`${subfield.code}-${subfield.value}-${index}`}
          >
            <span className="marc-sf">${subfield.code}</span> {subfield.value}
          </span>
        ))}
      </div>
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
