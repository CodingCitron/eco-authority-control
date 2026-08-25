import { useState } from "react";

import { AuthorityFixedFieldEditButton } from "./authority-fixed-field-edit-modal";
import { useMarcEditor, type SubField } from "./marc-editor-context";

interface MarcEditorProps {
  fontSize: string;
}

type EditorMode = "form" | "text";

export default function MarcEditor({ fontSize }: MarcEditorProps) {
  const [mode, setMode] = useState<EditorMode>("form");
  const { variableFields, setVariableFields } = useMarcEditor();

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

  const removeVariableField = (index: number) => {
    setVariableFields(
      variableFields.filter((_, fieldIndex) => fieldIndex !== index),
    );
  };

  return (
    <>
      <div className="card shadow-sm h-100">
        <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
          <span>MARC 레코드 뷰</span>
          <div className="d-flex gap-2">
            <button
              onClick={() => {
                setMode((prev) => (prev === "form" ? "text" : "form"));
              }}
            >
              {mode === "form" ? "편집:텍스트" : "편집:폼"}
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
              field.type === "control" ? (
                <MarcControlRow
                  key={`control-${field.tag}-${index}`}
                  onRemove={() => removeVariableField(index)}
                  tag={field.tag}
                  value={field.value}
                />
              ) : (
                <MarcRow
                  ind1={field.indicator1}
                  ind2={field.indicator2}
                  key={`data-${field.tag}-${index}`}
                  mode={mode}
                  onRemove={() => removeVariableField(index)}
                  subfields={field.subfields}
                  tag={field.tag}
                />
              )
            ))}
            <button
              type="button"
              className="marc-line marc-line-data d-flex justify-content-center"
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
            <button className="btn btn-primary">저장</button>{" "}
            <button className="btn btn-secondary">취소</button>
          </div>
        </div>
      </div>
    </>
  );
}

function MarcControlRow({
  onRemove,
  tag,
  value,
}: {
  onRemove: () => void;
  tag: string;
  value: string;
}) {
  return (
    <div className="marc-line marc-line-control d-flex align-items-center">
      <span className="marc-tag">{tag}</span>
      <span style={{ whiteSpace: "pre" }}>{value}</span>
      <span className="marc-eof">%</span>
      <button
        type="button"
        className="btn btn-sm p-0 ms-auto"
        aria-label={`${tag} 행 삭제`}
        onClick={onRemove}
      >
        <i className="bi bi-dash-circle fs-5"></i>
      </button>
    </div>
  );
}

interface MarcRowProps {
  mode: EditorMode;
  tag: string;
  ind1: string;
  ind2: string;
  onRemove: () => void;
  subfields: SubField[];
}

function MarcRow({ mode, tag, ind1, ind2, onRemove, subfields }: MarcRowProps) {
  return (
    <div className="marc-line marc-line-control d-flex align-items-center">
      <span className="marc-tag">{tag}</span>
      {ind1}
      {ind2}
      {subfields.map((subfield) => (
        <span key={`${subfield.code}-${subfield.value}`}>
          <span className="marc-sf">${subfield.code}</span> {subfield.value}
        </span>
      ))}

      {/* 필수 x: 마크 필드의 끝 의미 */}
      <span className="marc-eof">%</span>
      <button
        type="button"
        className="btn btn-sm p-0 ms-auto"
        aria-label="행 삭제"
        onClick={onRemove}
      >
        <i className="bi bi-dash-circle fs-5"></i>
      </button>
    </div>
  );
}
