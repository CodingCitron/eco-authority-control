import type { AuthorityDetailData } from "@/types/authority-detail.types";
import {
  sortMarcFields,
  type AuthorityCreateMetadata,
  type MarcDataField,
  type MarcField,
  type SubField,
} from "@/components/ui/marc-editor-context";
import { isAuthoritySearchType } from "@/types/authority.types";

export type PersonalGender = "" | "unknown" | "male" | "female";

/** 개인명 입력 화면에서 편집하는 값. API/MARC 구조와 화면 상태를 분리한다. */
export interface PersonalAuthorityFormValues {
  authorityType: string;
  region: string;
  heading: string;
  hanjaName: string;
  birthDate: string;
  deathDate: string;
  birthdatePrivate: boolean;
  referenceHeading: string;
  referenceHanja: string;
  referenceOriginalName: string;
  placeType: string;
  place: string;
  placeDateFrom: string;
  placeDateTo: string;
  addressType: string;
  address: string;
  activityField: string;
  activityFieldDateFrom: string;
  activityFieldDateTo: string;
  organization: string;
  organizationDateFrom: string;
  organizationDateTo: string;
  occupation: string;
  occupationDateFrom: string;
  occupationDateTo: string;
  gender: PersonalGender;
  language: string;
  historyVisibility: string;
  education: string;
  biography: string;
  source: string;
  copyrightConsent: boolean;
  copyrightConsentDate: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

/** 등록 화면은 예시 데이터 없이 모든 입력값을 비워서 시작한다. */
export function createEmptyPersonalAuthorityFormValues(): PersonalAuthorityFormValues {
  return {
    // 개인명 전용 화면이므로 신규 입력도 개인명(100)을 기본 선택한다.
    authorityType: "100",
    region: "",
    heading: "",
    hanjaName: "",
    birthDate: "",
    deathDate: "",
    birthdatePrivate: false,
    referenceHeading: "",
    referenceHanja: "",
    referenceOriginalName: "",
    placeType: "",
    place: "",
    placeDateFrom: "",
    placeDateTo: "",
    addressType: "",
    address: "",
    activityField: "",
    activityFieldDateFrom: "",
    activityFieldDateTo: "",
    organization: "",
    organizationDateFrom: "",
    organizationDateTo: "",
    occupation: "",
    occupationDateFrom: "",
    occupationDateTo: "",
    gender: "",
    language: "",
    historyVisibility: "",
    education: "",
    biography: "",
    source: "",
    copyrightConsent: false,
    copyrightConsentDate: "",
    createdBy: "",
    createdAt: "",
    updatedBy: "",
    updatedAt: "",
  };
}

const authorityTagTypeMap = {
  "100": "0",
  "110": "1",
  "150": "4",
  "151": "5",
} as const;

/** 개인명 입력 폼의 공통 항목을 전거 생성 API 메타데이터로 변환한다. */
export function mapPersonalFormValuesToAuthorityCreateMetadata(
  values: Pick<
    PersonalAuthorityFormValues,
    "authorityType" | "region" | "createdAt" | "createdBy"
  >,
): AuthorityCreateMetadata {
  const authorityType = values.authorityType.trim();
  const acType =
    authorityTagTypeMap[authorityType as keyof typeof authorityTagTypeMap] ??
    (isAuthoritySearchType(authorityType) ? authorityType : undefined);
  const acRegionCode = values.region.trim();
  const firstInputDate = values.createdAt.trim();
  const firstWorker = values.createdBy.trim();

  return {
    ...(acType && { acType }),
    ...(acRegionCode && { acRegionCode }),
    ...(firstInputDate && { firstInputDate }),
    ...(firstWorker && { firstWorker }),
  };
}

type DataField = AuthorityDetailData["record"]["data_fields"][number];

function getField(detail: AuthorityDetailData, tag: string) {
  return detail.record.data_fields.find((field) => field.tag === tag);
}

function getSubfield(field: DataField | undefined, code: string) {
  return (
    field?.subfields.find((subfield) => subfield.code === code)?.value ?? ""
  );
}

function getSubfieldFromFields(fields: DataField[], code: string) {
  return fields
    .map((field) => getSubfield(field, code))
    .find(Boolean) ?? "";
}

function splitBirthDeathDate(value: string) {
  const normalizedValue = value.trim();
  const match = normalizedValue.match(
    /^(\d{4}(?:-\d{2}(?:-\d{2})?)?)\s*[-~]\s*(\d{4}(?:-\d{2}(?:-\d{2})?)?)$/,
  );

  if (match) {
    return { birthDate: match[1], deathDate: match[2] };
  }

  return { birthDate: normalizedValue, deathDate: "" };
}

function getGender(value: string): PersonalGender {
  const normalizedValue = value.trim().toLowerCase();

  if (["m", "male", "남", "남성"].includes(normalizedValue)) {
    return "male";
  }
  if (["f", "female", "여", "여성"].includes(normalizedValue)) {
    return "female";
  }
  return normalizedValue ? "unknown" : "";
}

/** 상세 조회 결과를 수정 화면의 초기값으로 변환한다. */
export function mapAuthorityDetailToPersonalFormValues(
  detail: AuthorityDetailData,
): PersonalAuthorityFormValues {
  const field100 = getField(detail, "100");
  const fields046 = detail.record.data_fields.filter(
    (field) => field.tag === "046",
  );
  const headingDates = splitBirthDeathDate(
    detail.birthDeathDate || getSubfield(field100, "d"),
  );
  const dates = {
    birthDate:
      getSubfieldFromFields(fields046, "f") || headingDates.birthDate,
    deathDate:
      getSubfieldFromFields(fields046, "g") || headingDates.deathDate,
  };

  // 반복 가능 필드는 오른쪽 MARC 에디터에서 기존 값을 관리한다.
  // 왼쪽 입력은 새 필드를 연속해서 추가하는 draft이므로 초기값을 채우지 않는다.
  return {
    ...createEmptyPersonalAuthorityFormValues(),
    authorityType: detail.acType === "0" ? "100" : detail.acType,
    region: detail.acRegionCode ?? "",
    heading: detail.headingName ?? getSubfield(field100, "a"),
    hanjaName: detail.hanjaName ?? getSubfield(field100, "g"),
    ...dates,
    gender: getGender(getSubfield(getField(detail, "375"), "a")),
    createdBy: detail.firstWorker,
    createdAt: detail.firstInputDate,
    updatedBy: detail.lastWorker,
    updatedAt: detail.lastUpdateDate,
  };
}

export type PersonalMarcAddTarget =
  | "heading"
  | "birthDeathDate"
  | "referenceHeading"
  | "referenceHanja"
  | "referenceOriginalName"
  | "place"
  | "address"
  | "activityField"
  | "organization"
  | "occupation"
  | "language"
  | "education"
  | "biography"
  | "source";

const PLACE_SUBFIELD_CODE: Readonly<Record<string, string>> = {
  birth: "a",
  death: "b",
  residence: "e",
  activity: "f",
};

/** 왼쪽 개인명 폼의 한 항목을 오른쪽 MARC 레코드에 반영한다. */
export function addPersonalFormValuesToMarcFields(
  fields: MarcField[],
  target: PersonalMarcAddTarget,
  values: PersonalAuthorityFormValues,
) {
  switch (target) {
    case "heading":
      return updatePersonalHeading(fields, [
        toSubfield("a", values.heading),
        toSubfield("g", values.hanjaName),
      ]);
    case "birthDeathDate": {
      const date = formatBirthDeathDate(values.birthDate, values.deathDate);
      return date
        ? updateBirthDeathFields(fields, values.birthDate, values.deathDate, date)
        : fields;
    }
    case "referenceHeading":
      return appendDataField(
        fields,
        createDataField(
          "400",
          [
            toSubfield("a", values.referenceHeading),
            toSubfield("g", values.referenceHanja),
          ],
          "1",
        ),
      );
    case "referenceHanja":
      return updateReferenceHanja(fields, values);
    case "referenceOriginalName":
      return appendDataField(
        fields,
        createDataField(
          "400",
          [toSubfield("a", values.referenceOriginalName)],
          "1",
        ),
      );
    case "place":
      return appendDataField(
        fields,
        createDataField("370", [
          toSubfield(PLACE_SUBFIELD_CODE[values.placeType], values.place),
          toSubfield("s", values.placeDateFrom),
          toSubfield("t", values.placeDateTo),
        ]),
      );
    case "address":
      return appendDataField(
        fields,
        createDataField("371", [
          toSubfield(values.addressType, values.address),
        ]),
      );
    case "activityField":
      return appendRelatedDateField(
        fields,
        "372",
        values.activityField,
        values.activityFieldDateFrom,
        values.activityFieldDateTo,
      );
    case "organization":
      return appendRelatedDateField(
        fields,
        "373",
        values.organization,
        values.organizationDateFrom,
        values.organizationDateTo,
      );
    case "occupation":
      return appendRelatedDateField(
        fields,
        "374",
        values.occupation,
        values.occupationDateFrom,
        values.occupationDateTo,
      );
    case "language":
      return appendDataField(
        fields,
        createDataField("377", [toSubfield("i", values.language)]),
      );
    case "education":
      return appendDataField(
        fields,
        createDataField("667", [toSubfield("a", values.education)]),
      );
    case "biography":
      return appendDataField(
        fields,
        createDataField("678", [toSubfield("a", values.biography)]),
      );
    case "source":
      return appendDataField(
        fields,
        createDataField("670", [toSubfield("a", values.source)]),
      );
  }
}

/** 기존 레코드의 생몰년 표현 방식은 보존하고, 신규 값은 분리된 046으로 만든다. */
function updateBirthDeathFields(
  fields: MarcField[],
  birthDate: string,
  deathDate: string,
  headingDate: string,
) {
  const hasHeadingDate = fields.some(
    (field) =>
      field.type === "data" &&
      field.tag === "100" &&
      field.subfields.some(({ code }) => code === "d"),
  );
  const hasCodedDate = fields.some(
    (field) =>
      field.type === "data" &&
      field.tag === "046" &&
      field.subfields.some(({ code }) => code === "f" || code === "g"),
  );
  let nextFields = hasHeadingDate
    ? updatePersonalHeading(fields, [{ code: "d", value: headingDate }])
    : fields;

  // 046을 사용하던 레코드와 신규 레코드는 출생일·사망일을 각각 갱신/추가한다.
  if (hasCodedDate || !hasHeadingDate) {
    nextFields = upsertCodedDateField(nextFields, "f", birthDate);
    nextFields = upsertCodedDateField(nextFields, "g", deathDate);
  }

  return nextFields;
}

function upsertCodedDateField(
  fields: MarcField[],
  code: "f" | "g",
  value: string,
) {
  const dateSubfield = toSubfield(code, value);
  if (!dateSubfield) {
    return fields;
  }

  const fieldIndex = fields.findIndex(
    (field) =>
      field.type === "data" &&
      field.tag === "046" &&
      field.subfields.some((subfield) => subfield.code === code),
  );

  if (fieldIndex < 0) {
    return appendDataField(fields, createDataField("046", [dateSubfield]));
  }

  return sortMarcFields(
    fields.map((field, index) => {
      if (index !== fieldIndex || field.type !== "data") {
        return field;
      }

      return {
        ...field,
        subfields: field.subfields.map((subfield) =>
          subfield.code === code ? dateSubfield : subfield,
        ),
      };
    }),
  );
}

function updatePersonalHeading(
  fields: MarcField[],
  replacements: Array<SubField | undefined>,
) {
  const nextSubfields = replacements.filter((subfield): subfield is SubField =>
    Boolean(subfield),
  );
  if (nextSubfields.length === 0) {
    return fields;
  }

  const fieldIndex = fields.findIndex(
    (field) => field.type === "data" && field.tag === "100",
  );
  const currentField = fieldIndex >= 0 ? fields[fieldIndex] : undefined;
  const currentSubfields =
    currentField?.type === "data" ? currentField.subfields : [];
  const replacedCodes = new Set(nextSubfields.map(({ code }) => code));
  const mergedSubfields = orderPersonalNameSubfields([
    ...currentSubfields.filter(({ code }) => !replacedCodes.has(code)),
    ...nextSubfields,
  ]);
  const nextField: MarcDataField = {
    type: "data",
    tag: "100",
    indicator1: currentField?.type === "data" ? currentField.indicator1 : "1",
    indicator2: currentField?.type === "data" ? currentField.indicator2 : " ",
    subfields: mergedSubfields,
  };

  if (fieldIndex < 0) {
    return sortMarcFields([...fields, nextField]);
  }

  return sortMarcFields(
    fields.map((field, index) => (index === fieldIndex ? nextField : field)),
  );
}

function updateReferenceHanja(
  fields: MarcField[],
  values: PersonalAuthorityFormValues,
) {
  const hanjaName = values.referenceHanja.trim();
  if (!hanjaName) {
    return fields;
  }

  const referenceHeading = values.referenceHeading.trim();
  const fieldIndex = fields.findIndex(
    (field) =>
      field.type === "data" &&
      field.tag === "400" &&
      (!referenceHeading ||
        field.subfields.some(
          ({ code, value }) => code === "a" && value === referenceHeading,
        )),
  );

  if (fieldIndex < 0) {
    return referenceHeading
      ? appendDataField(
          fields,
          createDataField(
            "400",
            [
              { code: "a", value: referenceHeading },
              { code: "g", value: hanjaName },
            ],
            "1",
          ),
        )
      : fields;
  }

  const currentField = fields[fieldIndex];
  if (currentField.type !== "data") {
    return fields;
  }

  const nextField: MarcDataField = {
    ...currentField,
    subfields: [
      ...currentField.subfields.filter(({ code }) => code !== "g"),
      { code: "g", value: hanjaName },
    ],
  };

  return sortMarcFields(
    fields.map((field, index) => (index === fieldIndex ? nextField : field)),
  );
}

function appendRelatedDateField(
  fields: MarcField[],
  tag: string,
  value: string,
  dateFrom: string,
  dateTo: string,
) {
  return appendDataField(
    fields,
    createDataField(tag, [
      toSubfield("a", value),
      toSubfield("s", dateFrom),
      toSubfield("t", dateTo),
    ]),
  );
}

function appendDataField(
  fields: MarcField[],
  nextField: MarcDataField | undefined,
) {
  if (!nextField || fields.some((field) => isSameDataField(field, nextField))) {
    return fields;
  }

  return sortMarcFields([...fields, nextField]);
}

function createDataField(
  tag: string,
  subfields: Array<SubField | undefined>,
  indicator1 = " ",
): MarcDataField | undefined {
  const normalizedSubfields = subfields.filter(
    (subfield): subfield is SubField => Boolean(subfield),
  );
  if (normalizedSubfields.length === 0) {
    return undefined;
  }

  return {
    type: "data",
    tag,
    indicator1,
    indicator2: " ",
    subfields: normalizedSubfields,
  };
}

function toSubfield(code: string | undefined, value: string) {
  const normalizedCode = code?.trim();
  const normalizedValue = value.trim();
  return normalizedCode && normalizedValue
    ? { code: normalizedCode, value: normalizedValue }
    : undefined;
}

function formatBirthDeathDate(birthDate: string, deathDate: string) {
  const normalizedBirthDate = birthDate.trim();
  const normalizedDeathDate = deathDate.trim();

  if (normalizedBirthDate && normalizedDeathDate) {
    return `${normalizedBirthDate}-${normalizedDeathDate}`;
  }
  if (normalizedDeathDate) {
    return `-${normalizedDeathDate}`;
  }
  return normalizedBirthDate;
}

function orderPersonalNameSubfields(subfields: SubField[]) {
  const order = ["a", "g", "d"];
  return subfields
    .map((subfield, index) => ({ subfield, index }))
    .sort((left, right) => {
      const leftOrder = order.indexOf(left.subfield.code);
      const rightOrder = order.indexOf(right.subfield.code);
      const normalizedLeftOrder = leftOrder < 0 ? order.length : leftOrder;
      const normalizedRightOrder = rightOrder < 0 ? order.length : rightOrder;
      return (
        normalizedLeftOrder - normalizedRightOrder || left.index - right.index
      );
    })
    .map(({ subfield }) => subfield);
}

function isSameDataField(field: MarcField, nextField: MarcDataField) {
  return (
    field.type === "data" &&
    field.tag === nextField.tag &&
    field.indicator1 === nextField.indicator1 &&
    field.indicator2 === nextField.indicator2 &&
    field.subfields.length === nextField.subfields.length &&
    field.subfields.every(
      (subfield, index) =>
        subfield.code === nextField.subfields[index].code &&
        subfield.value === nextField.subfields[index].value,
    )
  );
}
