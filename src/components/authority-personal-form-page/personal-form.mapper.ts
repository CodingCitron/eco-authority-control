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
  sortMarcSubfields,
  type MarcSubfieldReplacement,
} from "@/lib/marc/marc-field.utils";
import type {
  AuthorityCreateMetadata,
  MarcDataField,
  MarcField,
} from "@/types/marc-editor.types";
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
  const field100 = findMarcFieldByTag(detail.record.data_fields, "100");
  const fields046 = detail.record.data_fields.filter(
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
    gender: getGender(
      getMarcSubfieldValue(
        findMarcFieldByTag(detail.record.data_fields, "375"),
        "a",
      ),
    ),
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
        { code: "a", value: values.heading },
        { code: "g", value: values.hanjaName },
      ]);
    case "birthDeathDate": {
      const date = formatBirthDeathDate(values.birthDate, values.deathDate);
      return updateBirthDeathFields(
        fields,
        values.birthDate,
        values.deathDate,
        date,
      );
    }
    case "referenceHeading":
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
    case "referenceHanja":
      return updateReferenceHanja(fields, values);
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
      return appendMarcDataField(
        fields,
        createMarcDataField("377", [
          createMarcSubfield("i", values.language),
        ]),
      );
    case "education":
      return appendMarcDataField(
        fields,
        createMarcDataField("667", [
          createMarcSubfield("a", values.education),
        ]),
      );
    case "biography":
      return appendMarcDataField(
        fields,
        createMarcDataField("678", [
          createMarcSubfield("a", values.biography),
        ]),
      );
    case "source":
      return appendMarcDataField(
        fields,
        createMarcDataField("670", [
          createMarcSubfield("a", values.source),
        ]),
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
  const dateSubfield = createMarcSubfield(code, value);
  if (!dateSubfield) {
    return sortMarcFields(
      fields.flatMap((field): MarcField[] => {
        if (
          field.type !== "data" ||
          field.tag !== "046" ||
          !field.subfields.some((subfield) => subfield.code === code)
        ) {
          return [field];
        }

        const nextField = replaceMarcDataFieldSubfields(field, [
          { code, value: "" },
        ]);
        return nextField ? [nextField] : [];
      }),
    );
  }

  const fieldIndex = fields.findIndex(
    (field) =>
      field.type === "data" &&
      field.tag === "046" &&
      field.subfields.some((subfield) => subfield.code === code),
  );

  if (fieldIndex < 0) {
    return appendMarcDataField(
      fields,
      createMarcDataField("046", [dateSubfield]),
    );
  }

  const currentField = fields[fieldIndex];
  if (currentField.type !== "data") {
    return fields;
  }

  const nextField = replaceMarcDataFieldSubfields(currentField, [
    { code, value: dateSubfield.value },
  ]);
  return sortMarcFields(
    fields.flatMap((field, index): MarcField[] => {
      if (index !== fieldIndex) {
        return [field];
      }
      return nextField ? [nextField] : [];
    }),
  );
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
        replacements.map(({ code, value }) =>
          createMarcSubfield(code, value),
        ),
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
      ? appendMarcDataField(
          fields,
          createMarcDataField(
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
    subfields: sortMarcSubfields("400", [
      ...currentField.subfields.filter(({ code }) => code !== "g"),
      { code: "g", value: hanjaName },
    ]),
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
