// 고정 길이 필드 편집 모달

import { useRef, useState } from "react";
import { useController, useForm, type Control } from "react-hook-form";
import { Modal } from "react-bootstrap";

import BaseModal from "./base-modal";
import {
  EMPTY_CONTROL_FIELD_008,
  formatControlField008,
  parseControlField008,
  useMarcEditor,
  type ControlField008,
  type LeaderData,
} from "./marc-editor-context";
import type { MarcControlField } from "@/types/marc-editor.types";

import { getCodeSet } from "marc-eco";

type FixedFieldFormValues = LeaderData & ControlField008;

type FieldDefinition = {
  name: Exclude<keyof FixedFieldFormValues, "raw" | "sourceValue">;
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
      label: "기본표목/부출표목",
      defaultValue: "",
      codeSet: "FIX_008_14",
    },
    {
      name: "subjAddedEntry",
      label: "주제명부출표목",
      defaultValue: "",
      codeSet: "FIX_008_15",
    },
    {
      name: "seriesAddedEntry",
      label: "총서부출표목",
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
    {
      name: "nameType",
      label: "이름 유형",
      defaultValue: "",
      codeSet: "FIX_008_32",
    },
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

function hasControlField008Input(data: ControlField008) {
  return Object.entries(data).some(
    ([name, value]) =>
      name !== "sourceValue" && typeof value === "string" && value.length > 0,
  );
}

function FixedFieldInput({
  field,
  control,
  className = "col",
}: {
  field: FieldDefinition;
  control: Control<FixedFieldFormValues>;
  className?: string;
}) {
  const id = `f008_${field.name}`;
  const listboxId = `${id}_listbox`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filterText, setFilterText] = useState("");

  // 입력값은 별도 로컬 상태로 복제하지 않고 react-hook-form을 단일 상태로 사용
  const { field: inputField } = useController({
    control,
    name: field.name,
  });

  // 단일 코드값을 가진 코드셋만 추천 목록으로 사용
  // 코드셋이 없거나 위치별 코드셋이면 아래의 일반 입력창으로 처리.
  const codeSet = field.codeSet ? getCodeSet(field.codeSet) : undefined;
  const options =
    codeSet && "values" in codeSet ? Object.entries(codeSet.values) : [];

  // 코드뿐 아니라 사용자에게 보이는 설명으로도 추천값을 검색
  const normalizedFilter = filterText.trim().toLocaleLowerCase();
  const filteredOptions = normalizedFilter
    ? options.filter(
        ([code, option]) =>
          code.toLocaleLowerCase().includes(normalizedFilter) ||
          option.label.toLocaleLowerCase().includes(normalizedFilter),
      )
    : options;

  const selectOption = (code: string) => {
    inputField.onChange(code);
    setFilterText("");
    setIsOpen(false);

    // 목록을 선택한 뒤에도 연속 입력이 가능하도록 입력창에 포커스
    inputRef.current?.focus();
  };

  const openOptions = () => {
    if (options.length === 0) {
      return;
    }

    setFilterText("");
    setActiveIndex(0);
    setIsOpen(true);
  };

  return (
    <div className={className}>
      <label className="form-label" htmlFor={id}>
        {field.label}
      </label>
      {options.length > 0 ? (
        <div className="position-relative">
          <div className="input-group">
            <input
              {...inputField}
              aria-activedescendant={
                isOpen && filteredOptions[activeIndex]
                  ? `${listboxId}_${activeIndex}`
                  : undefined
              }
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-expanded={isOpen}
              autoComplete="off"
              className="form-control"
              id={id}
              onBlur={() => {
                inputField.onBlur();
                setIsOpen(false);
              }}
              onChange={(event) => {
                // 추천 목록에 없는 값도 허용하므로 입력값을 그대로 폼에 반영
                inputField.onChange(event);
                setFilterText(event.target.value);
                setActiveIndex(0);
                setIsOpen(true);
              }}
              onFocus={openOptions}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" && filteredOptions.length > 0) {
                  event.preventDefault();
                  setIsOpen(true);
                  setActiveIndex(
                    (currentIndex) =>
                      (currentIndex + 1) % filteredOptions.length,
                  );
                } else if (
                  event.key === "ArrowUp" &&
                  filteredOptions.length > 0
                ) {
                  event.preventDefault();
                  setIsOpen(true);
                  setActiveIndex(
                    (currentIndex) =>
                      (currentIndex - 1 + filteredOptions.length) %
                      filteredOptions.length,
                  );
                } else if (
                  event.key === "Enter" &&
                  isOpen &&
                  filteredOptions[activeIndex]
                ) {
                  event.preventDefault();
                  selectOption(filteredOptions[activeIndex][0]);
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  setIsOpen(false);
                }
              }}
              ref={(element) => {
                inputField.ref(element);
                inputRef.current = element;
              }}
              role="combobox"
              type="text"
            />
            <button
              aria-label={`${field.label} 선택 항목 보기`}
              aria-expanded={isOpen}
              className="btn btn-outline-secondary"
              onClick={() => {
                if (isOpen) {
                  setIsOpen(false);
                } else {
                  openOptions();
                  inputRef.current?.focus();
                }
              }}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              <i className="bi bi-chevron-down" aria-hidden="true" />
            </button>
          </div>
          {isOpen && filteredOptions.length > 0 && (
            <div
              className="dropdown-menu show py-1"
              id={listboxId}
              role="listbox"
              style={{ maxHeight: "16rem", overflowY: "auto", zIndex: 1080 }}
            >
              {filteredOptions.map(([code, option], index) => (
                <button
                  aria-selected={activeIndex === index}
                  className={`dropdown-item${activeIndex === index ? " active" : ""}`}
                  id={`${listboxId}_${index}`}
                  key={code}
                  onClick={() => selectOption(code)}
                  // 클릭 전에 input의 blur가 발생해 목록이 닫히는 것을 막는다.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  type="button"
                >
                  <span className="fw-semibold">
                    {code === " " ? "공백" : code}
                  </span>
                  <span className="ms-2">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        // 추천값이 없는 필드는 자유 입력 필드로 표시한다.
        <input {...inputField} className="form-control" id={id} type="text" />
      )}
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
  const { leaderData, variableFields, setLeaderData, setVariableFields } =
    useMarcEditor();
  const field008 = variableFields.find(
    (field): field is MarcControlField =>
      field.type === "control" && field.tag === "008",
  );
  const controlField008 = field008
    ? parseControlField008(field008.value)
    : EMPTY_CONTROL_FIELD_008;

  const { control, handleSubmit } = useForm<FixedFieldFormValues>({
    defaultValues: {
      ...DEFAULT_VALUES,
      ...controlField008,
      ...leaderData,
    },
  });

  const handleConfirm = (values: FixedFieldFormValues) => {
    const { status, type, encodingLevel, raw, ...nextControlField008 } = values;
    const nextField008: MarcControlField = {
      type: "control",
      tag: "008",
      value: formatControlField008({
        ...nextControlField008,
        sourceValue: controlField008.sourceValue,
      }),
    };
    const field008Index = variableFields.findIndex(
      (field) => field.type === "control" && field.tag === "008",
    );

    // 업데이트 할때 raw를 업데이트 해주어야 하나?
    setLeaderData({
      status,
      type,
      encodingLevel,
      raw: raw ?? leaderData.raw,
    });

    // 기존 008도 없고 입력값도 없다면 Leader만 갱신한다.
    if (field008Index < 0 && !hasControlField008Input(nextControlField008)) {
      onHide();
      return;
    }

    if (field008Index >= 0) {
      setVariableFields(
        variableFields.map((field, index) =>
          index === field008Index ? nextField008 : field,
        ),
      );
    } else {
      const nextFields = [...variableFields];
      const firstDataFieldIndex = nextFields.findIndex(
        (field) => field.type === "data",
      );
      nextFields.splice(
        firstDataFieldIndex >= 0 ? firstDataFieldIndex : nextFields.length,
        0,
        nextField008,
      );
      setVariableFields(nextFields);
    }
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
                control={control}
                field={field}
                key={field.name}
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
                  control={control}
                  field={field}
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
