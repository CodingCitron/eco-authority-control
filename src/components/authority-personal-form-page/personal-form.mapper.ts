import type { AuthorityDetailData } from "@/types/authority-detail.types";
import {
  sortMarcFields,
  type AuthorityCreateMetadata,
  type MarcDataField,
  type MarcField,
  type SubField,
} from "@/components/ui/marc-editor-context";
import { isAuthoritySearchType } from "@/types/authority-search.types";

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

function getFields(detail: AuthorityDetailData, tag: string) {
  return detail.record.data_fields.filter((field) => field.tag === tag);
}

function getField(detail: AuthorityDetailData, tag: string) {
  return getFields(detail, tag)[0];
}

function getSubfield(field: DataField | undefined, code: string) {
  return (
    field?.subfields.find((subfield) => subfield.code === code)?.value ?? ""
  );
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

function getPlace(field: DataField | undefined) {
  const placeTypes = [
    { code: "a", type: "birth" },
    { code: "b", type: "death" },
    { code: "e", type: "residence" },
    { code: "f", type: "activity" },
  ] as const;
  const matched = placeTypes.find(({ code }) => getSubfield(field, code));

  return matched
    ? { type: matched.type, value: getSubfield(field, matched.code) }
    : { type: "", value: "" };
}

function getAddress(field: DataField | undefined) {
  const codes = ["a", "b", "d", "e", "m"] as const;
  const code = codes.find((candidate) => getSubfield(field, candidate));

  return code
    ? { type: code, value: getSubfield(field, code) }
    : { type: "", value: "" };
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
  const fields400 = getFields(detail, "400");
  const field370 = getField(detail, "370");
  const field371 = getField(detail, "371");
  const field372 = getField(detail, "372");
  const field373 = getField(detail, "373");
  const field374 = getField(detail, "374");
  const place = getPlace(field370);
  const address = getAddress(field371);
  const dates = splitBirthDeathDate(
    detail.birthDeathDate ?? getSubfield(field100, "d"),
  );

  return {
    ...createEmptyPersonalAuthorityFormValues(),
    authorityType: detail.acType === "0" ? "100" : detail.acType,
    region: detail.acRegionCode ?? "",
    heading: detail.headingName ?? getSubfield(field100, "a"),
    hanjaName: detail.hanjaName ?? getSubfield(field100, "g"),
    ...dates,
    referenceHeading: getSubfield(fields400[0], "a"),
    referenceHanja: getSubfield(fields400[0], "g"),
    referenceOriginalName: getSubfield(fields400[1], "a"),
    placeType: place.type,
    place: place.value,
    placeDateFrom: getSubfield(field370, "s"),
    placeDateTo: getSubfield(field370, "t"),
    addressType: address.type,
    address: address.value,
    activityField: detail.activityField || getSubfield(field372, "a"),
    activityFieldDateFrom: getSubfield(field372, "s"),
    activityFieldDateTo: getSubfield(field372, "t"),
    organization: getSubfield(field373, "a"),
    organizationDateFrom: getSubfield(field373, "s"),
    organizationDateTo: getSubfield(field373, "t"),
    occupation: getSubfield(field374, "a"),
    occupationDateFrom: getSubfield(field374, "s"),
    occupationDateTo: getSubfield(field374, "t"),
    gender: getGender(getSubfield(getField(detail, "375"), "a")),
    language:
      getSubfield(getField(detail, "377"), "i") ||
      getSubfield(getField(detail, "377"), "a"),
    education: getSubfield(getField(detail, "667"), "a"),
    biography: getSubfield(getField(detail, "678"), "a"),
    source: getSubfield(getField(detail, "670"), "a") || detail.sourceDataFound,
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
        ? updatePersonalHeading(fields, [{ code: "d", value: date }])
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
