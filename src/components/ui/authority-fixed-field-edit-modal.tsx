// 고정 길이 필드 편집 모달

import { useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { Modal } from "react-bootstrap";

import BaseModal from "./base-modal";
import type { ControlField008, LeaderData } from "./marc-editor-context";

type FixedFieldFormValues = LeaderData & ControlField008;

type FieldDefinition = {
  name: Exclude<keyof FixedFieldFormValues, "raw">;
  label: string;
  defaultValue: string;
};

const LEADER_FIELDS: FieldDefinition[] = [
  { name: "status", label: "상 태", defaultValue: "" },
  { name: "type", label: "형 태", defaultValue: "" },
  { name: "encodingLevel", label: "입력수준", defaultValue: "" },
];

const BIBLIOGRAPHIC_FIELD_ROWS: FieldDefinition[][] = [
  [
    { name: "entryDate", label: "입력날짜", defaultValue: "" },
    { name: "geoSubdivision", label: "지리구분", defaultValue: "" },
    { name: "romanization", label: "로마자번자표", defaultValue: "" },
    { name: "recordKind", label: "레코드 종류", defaultValue: "" },
    { name: "catalogingForm", label: "목록기술형식", defaultValue: "" },
    { name: "subjectHeading", label: "주제명표목표", defaultValue: "" },
    { name: "seriesType", label: "총서유형", defaultValue: "" },
  ],
  [
    { name: "seriesNumFlag", label: "총서번호 유무", defaultValue: "" },
    { name: "mainHeadingUse", label: "표목사용(주표목)", defaultValue: "" },
    { name: "subjAddedEntry", label: "주제부출표목", defaultValue: "" },
    { name: "seriesAddedEntry", label: "총서부출표목", defaultValue: "" },
    { name: "subjectSubtype", label: "주제세목유형", defaultValue: "" },
    { name: "referenceEvaluation", label: "참조평가", defaultValue: "" },
    { name: "recordUpdate", label: "레코드갱신", defaultValue: "" },
  ],
  [
    { name: "nameType", label: "이름 유형", defaultValue: "" },
    { name: "headingLevel", label: "채택표목수준", defaultValue: "" },
    { name: "modifiedRecord", label: "수정레코드", defaultValue: "" },
    { name: "catalogingAgency", label: "목록작성기관", defaultValue: "" },
  ],
];

function createDefaultValues(): FixedFieldFormValues {
  const defaultValues: FixedFieldFormValues = {
    status: "",
    type: "",
    encodingLevel: "",
    entryDate: "",
  };

  [...LEADER_FIELDS, ...BIBLIOGRAPHIC_FIELD_ROWS.flat()].forEach(
    ({ name, defaultValue }) => {
      defaultValues[name] = defaultValue;
    },
  );

  return defaultValues;
}

const DEFAULT_VALUES = createDefaultValues();

function FixedFieldInput({
  field,
  register,
  className = "col",
}: {
  field: FieldDefinition;
  register: UseFormRegister<FixedFieldFormValues>;
  className?: string;
}) {
  const id = `f008_${field.name}`;

  return (
    <div className={className}>
      <label className="form-label" htmlFor={id}>
        {field.label}
      </label>
      <input
        type="text"
        className="form-control"
        id={id}
        {...register(field.name)}
      />
    </div>
  );
}

export function AuthorityFixedFieldEditButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-light"
        onClick={() => setModalIsOpen(true)}
      >
        고정길이편집
      </button>
      <AuthorityFixedFieldEditModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export default function AuthorityFixedFieldEditModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <BaseModal show={show} onHide={onHide}>
      <AuthorityFixedFieldEditModalBody onHide={onHide} />
    </BaseModal>
  );
}

export function AuthorityFixedFieldEditModalBody({
  onHide,
}: {
  onHide: () => void;
}) {
  const { handleSubmit, register } = useForm<FixedFieldFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const handleConfirm = (values: FixedFieldFormValues) => {
    // 저장 API가 연결되면 values를 전달한다.
    void values;
    onHide();
  };

  return (
    <form onSubmit={handleSubmit(handleConfirm)}>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          고정길이편집 (008)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="box-group border rounded mb-4">
          <div className="bg-light px-3 py-2 fw-bold border-bottom">리더</div>
          <div className="row g-3 p-3">
            {LEADER_FIELDS.map((field) => (
              <FixedFieldInput
                className="col-md-4"
                field={field}
                key={field.name}
                register={register}
              />
            ))}
          </div>
        </div>
        <div className="box-group border rounded">
          <div className="px-3 py-2 fw-bold border-bottom">
            부호화정보필드(008)
          </div>
          {BIBLIOGRAPHIC_FIELD_ROWS.map((fields, index) => (
            <div
              className={`row g-3 p-3${index > 0 ? " pt-0" : ""}`}
              key={index}
            >
              {fields.map((field) => (
                <FixedFieldInput
                  field={field}
                  register={register}
                  key={field.name}
                />
              ))}
              {Array.from({ length: 7 - fields.length }, (_, emptyIndex) => (
                <div className="col" key={`empty-${emptyIndex}`} />
              ))}
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="submit" className="btn btn-primary">
          확인
        </button>
        <button type="button" className="btn btn-secondary" onClick={onHide}>
          닫기
        </button>
      </Modal.Footer>
    </form>
  );
}

// 기존 오타가 포함된 named export를 사용하는 곳과의 호환성을 유지
export { AuthorityFixedFieldEditModalBody as AutohrityFixedFieldEditModalBody };
