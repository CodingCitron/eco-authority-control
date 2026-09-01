import type { AuthorityDetailData } from "@/types/authority-detail.types";
import {
  appendMarcDataField,
  createMarcDataField,
  createMarcSubfield,
  findMarcFieldByTag,
  getMarcSubfieldValue,
  getMarcSubfieldValueFromFields,
  replaceMarcDataFieldSubfields,
  sortMarcFields,
  type MarcSubfieldReplacement,
} from "@/lib/marc/marc-field.utils";
import type {
  AuthorityCreateMetadata,
  MarcField,
} from "@/types/marc-editor.types";
import type { AuthorityYesNo } from "@/types/authority.types";

export type PersonalGender = "" | "unknown" | "male" | "female";

/** 개인명 입력 화면에서 편집하는 값. API/MARC 구조와 화면 상태를 분리한다. */
export interface PersonalAuthorityFormValues {
  authorityType: string;
  region: string;
  heading: string;
  hanjaName: string;
  birthDate: string;
  deathDate: string;
  birthDeathDatePrivateYn: AuthorityYesNo;
  referenceHeading: string;
  referenceHanja: string;
  referenceOriginalName: string;
  placeType: string;
  place: string;
  placeDateFrom: string;
  placeDateTo: string;
  addressType: string;
  address: string;
  otherAttribute: string;
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
  biography: string;
  biographyPrivateYn: "" | AuthorityYesNo;
  education: string;
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
    birthDeathDatePrivateYn: "N",
    referenceHeading: "",
    referenceHanja: "",
    referenceOriginalName: "",
    placeType: "",
    place: "",
    placeDateFrom: "",
    placeDateTo: "",
    addressType: "",
    address: "",
    otherAttribute: "",
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
    biographyPrivateYn: "N",
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

/** 개인명 입력 폼의 공통 항목을 전거 생성 API 메타데이터로 변환한다. */
export function mapPersonalFormValuesToAuthorityCreateMetadata(
  values: Pick<
    PersonalAuthorityFormValues,
    | "region"
    | "birthDeathDatePrivateYn"
    | "biographyPrivateYn"
    | "copyrightConsent"
    | "copyrightConsentDate"
  >,
): AuthorityCreateMetadata {
  const acRegionCode = values.region.trim();
  const biographyPrivateYn = values.biographyPrivateYn || "N";
  const copyrightBlanketAgreeYn = values.copyrightConsent ? "Y" : "N";
  const copyrightBlanketAgreeDate =
    toIsoDateTime(values.copyrightConsentDate) ?? "";

  return {
    ...(acRegionCode && { acRegionCode }),
    birthDeathDatePrivateYn: values.birthDeathDatePrivateYn,
    biographyPrivateYn,
    copyrightBlanketAgreeYn,
    copyrightBlanketAgreeDate,
  };
}

function toIsoDateTime(value: string) {
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return undefined;
  }

  const date = new Date(normalizedValue);
  return Number.isNaN(date.getTime()) ? normalizedValue : date.toISOString();
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
  const field100 = findMarcFieldByTag(detail.record.dataFields, "100");
  const fields046 = detail.record.dataFields.filter(
    (field) => field.tag === "046",
  );
  const headingDates = splitBirthDeathDate(
    detail.birthDeathDate || getMarcSubfieldValue(field100, "d"),
  );
  const dates = {
    birthDate:
      getMarcSubfieldValueFromFields(fields046, "f") || headingDates.birthDate,
    deathDate:
      getMarcSubfieldValueFromFields(fields046, "g") || headingDates.deathDate,
  };

  // 반복 가능 필드는 오른쪽 MARC 에디터에서 기존 값을 관리한다.
  // 왼쪽 입력은 새 필드를 연속해서 추가하는 draft이므로 초기값을 채우지 않는다.
  return {
    ...createEmptyPersonalAuthorityFormValues(),
    authorityType: detail.acType === "0" ? "100" : detail.acType,
    region: detail.acRegionCode ?? "",
    heading: detail.headingName ?? getMarcSubfieldValue(field100, "a"),
    hanjaName: detail.hanjaName ?? getMarcSubfieldValue(field100, "g"),
    ...dates,
    biographyPrivateYn: detail.biographyPrivateYn ?? "N",
    birthDeathDatePrivateYn: detail.birthDeathDatePrivateYn ?? "N",
    gender: getGender(
      getMarcSubfieldValue(
        findMarcFieldByTag(detail.record.dataFields, "375"),
        "a",
      ),
    ),
    createdBy: detail.firstWorker ?? "",
    createdAt: detail.firstInputDate ?? "",
    updatedBy: detail.lastWorker ?? "",
    updatedAt: detail.lastUpdateDate ?? "",
  };
}

export type PersonalMarcAddTarget =
  | "heading"
  | "references"
  | "referenceOriginalName"
  | "place"
  | "address"
  | "otherAttribute"
  | "activityField"
  | "organization"
  | "occupation"
  | "gender"
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

const GENDER_LABEL: Readonly<Record<Exclude<PersonalGender, "">, string>> = {
  unknown: "모름",
  male: "남성",
  female: "여성",
};

/** 왼쪽 개인명 폼의 한 항목을 오른쪽 MARC 레코드에 반영한다. */
export function addPersonalFormValuesToMarcFields(
  fields: MarcField[],
  target: PersonalMarcAddTarget,
  values: PersonalAuthorityFormValues,
) {
  switch (target) {
    case "heading": {
      const date = formatBirthDeathDate(values.birthDate, values.deathDate);
      return updatePersonalHeading(fields, [
        { code: "a", value: values.heading },
        { code: "g", value: values.hanjaName },
        { code: "d", value: date },
      ]);
    }
    case "references": {
      return appendMarcDataField(
        fields,
        createMarcDataField(
          "400",
          [
            createMarcSubfield("a", values.referenceHeading),
            createMarcSubfield("g", values.referenceHanja),
          ],
          "1",
        ),
      );
    }
    case "referenceOriginalName":
      return appendMarcDataField(
        fields,
        createMarcDataField(
          "400",
          [createMarcSubfield("a", values.referenceOriginalName)],
          "1",
        ),
      );
    case "place":
      return appendMarcDataField(
        fields,
        createMarcDataField("370", [
          createMarcSubfield(
            PLACE_SUBFIELD_CODE[values.placeType],
            values.place,
          ),
          createMarcSubfield("s", values.placeDateFrom),
          createMarcSubfield("t", values.placeDateTo),
        ]),
      );
    case "address":
      return appendMarcDataField(
        fields,
        createMarcDataField("371", [
          createMarcSubfield(values.addressType, values.address),
        ]),
      );
    case "otherAttribute":
      return appendMarcDataField(
        fields,
        createMarcDataField("368", [
          createMarcSubfield("c", values.otherAttribute),
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
    case "gender":
      return appendMarcDataField(
        fields,
        createMarcDataField("375", [
          createMarcSubfield("a", values.gender && GENDER_LABEL[values.gender]),
        ]),
      );
    case "language":
      return appendMarcDataField(
        fields,
        createMarcDataField("377", [createMarcSubfield("i", values.language)]),
      );
    case "education":
      return appendMarcDataField(
        fields,
        createMarcDataField("667", [createMarcSubfield("a", values.education)]),
      );
    case "biography":
      return appendMarcDataField(
        fields,
        createMarcDataField("678", [createMarcSubfield("a", values.biography)]),
      );
    case "source":
      return appendMarcDataField(
        fields,
        createMarcDataField("670", [createMarcSubfield("a", values.source)]),
      );
  }
}

function updatePersonalHeading(
  fields: MarcField[],
  replacements: readonly MarcSubfieldReplacement[],
) {
  const fieldIndex = fields.findIndex(
    (field) => field.type === "data" && field.tag === "100",
  );

  if (fieldIndex < 0) {
    return appendMarcDataField(
      fields,
      createMarcDataField(
        "100",
        replacements.map(({ code, value }) => createMarcSubfield(code, value)),
        "1",
      ),
    );
  }

  const currentField = fields[fieldIndex];
  if (currentField.type !== "data") {
    return fields;
  }

  const nextField = replaceMarcDataFieldSubfields(currentField, replacements);
  return sortMarcFields(
    fields.flatMap((field, index): MarcField[] => {
      if (index !== fieldIndex) {
        return [field];
      }
      return nextField ? [nextField] : [];
    }),
  );
}

function appendRelatedDateField(
  fields: MarcField[],
  tag: string,
  value: string,
  dateFrom: string,
  dateTo: string,
) {
  return appendMarcDataField(
    fields,
    createMarcDataField(tag, [
      createMarcSubfield("a", value),
      createMarcSubfield("s", dateFrom),
      createMarcSubfield("t", dateTo),
    ]),
  );
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
