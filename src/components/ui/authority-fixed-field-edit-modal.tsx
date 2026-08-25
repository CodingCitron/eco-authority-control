// 고정 길이 필드 편집 모달

import { useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { Modal } from "react-bootstrap";

import BaseModal from "./base-modal";
import {
  useMarcEditor,
  type ControlField008,
  type LeaderData,
} from "./marc-editor-context";

import { getCodeSet } from "marc-eco";

type FixedFieldFormValues = LeaderData & ControlField008;

type FieldDefinition = {
  name: Exclude<keyof FixedFieldFormValues, "raw">;
  label: string;
  defaultValue: string;
  codeSet: string;
};

const LEADER_FIELDS: FieldDefinition[] = [
  {
    name: "status",
    label: "상 태",
    defaultValue: "",
    codeSet: "LEADER_STATUS",
  },
  { name: "type", label: "형 태", defaultValue: "", codeSet: "LEADER_TYPE" },
  {
    name: "encodingLevel",
    label: "입력수준",
    defaultValue: "",
    codeSet: "LEADER_INPUT_LEVEL",
  },
];

const BIBLIOGRAPHIC_FIELD_ROWS: FieldDefinition[][] = [
  [
    { name: "entryDate", label: "입력날짜", defaultValue: "", codeSet: "" },
    {
      name: "geoSubdivision",
      label: "지리구분",
      defaultValue: "",
      codeSet: "FIX_008_06",
    },
    {
      name: "romanization",
      label: "로마자번자표",
      defaultValue: "",
      codeSet: "FIX_008_07",
    },
    {
      name: "recordKind",
      label: "레코드 종류",
      defaultValue: "",
      codeSet: "FIX_008_09",
    },
    {
      name: "catalogingForm",
      label: "목록기술형식",
      defaultValue: "",
      codeSet: "FIX_008_10",
    },
    {
      name: "subjectHeading",
      label: "주제명표목표",
      defaultValue: "",
      codeSet: "FIX_008_11",
    },
    {
      name: "seriesType",
      label: "총서유형",
      defaultValue: "",
      codeSet: "FIX_008_12",
    },
  ],
  [
    {
      name: "seriesNumFlag",
      label: "총서번호 유무",
      defaultValue: "",
      codeSet: "FIX_008_13",
    },
    {
      name: "mainHeadingUse",
      label: "표목사용–기본표목/부출표목",
      defaultValue: "",
      codeSet: "FIX_008_14",
    },
    {
      name: "subjAddedEntry",
      label: "표목사용–주제명부출표목",
      defaultValue: "",
      codeSet: "FIX_008_15",
    },
    {
      name: "seriesAddedEntry",
      label: "표목사용–총서부출표목",
      defaultValue: "",
      codeSet: "FIX_008_16",
    },
    {
      name: "subjectSubtype",
      label: "주제세목유형",
      defaultValue: "",
      codeSet: "FIX_008_17",
    },
    {
      name: "referenceEvaluation",
      label: "참조평가",
      defaultValue: "",
      codeSet: "FIX_008_29",
    },
    {
      name: "recordUpdate",
      label: "레코드갱신",
      defaultValue: "",
      codeSet: "FIX_008_31",
    },
  ],
  [
    { name: "nameType", label: "이름 유형", defaultValue: "", codeSet: "" },
    {
      name: "headingLevel",
      label: "채택표목수준",
      defaultValue: "",
      codeSet: "FIX_008_33",
    },
    {
      name: "modifiedRecord",
      label: "수정레코드",
      defaultValue: "",
      codeSet: "FIX_008_38",
    },
    {
      name: "catalogingAgency",
      label: "목록작성기관",
      defaultValue: "",
      codeSet: "FIX_008_39",
    },
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
  const { leaderData, variableFields } = useMarcEditor();

  console.log(leaderData);
  console.log(variableFields);

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
