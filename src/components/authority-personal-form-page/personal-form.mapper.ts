import type { AuthorityDetailData } from "@/types/authority-detail.types";

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
    authorityType: "",
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

type DataField = AuthorityDetailData["record"]["data_fields"][number];

function getFields(detail: AuthorityDetailData, tag: string) {
  return detail.record.data_fields.filter((field) => field.tag === tag);
}

function getField(detail: AuthorityDetailData, tag: string) {
  return getFields(detail, tag)[0];
}

function getSubfield(field: DataField | undefined, code: string) {
  return field?.subfields.find((subfield) => subfield.code === code)?.value ?? "";
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
    source:
      getSubfield(getField(detail, "670"), "a") || detail.sourceDataFound,
    createdBy: detail.firstWorker,
    createdAt: detail.firstInputDate,
    updatedBy: detail.lastWorker,
    updatedAt: detail.lastUpdateDate,
  };
}
