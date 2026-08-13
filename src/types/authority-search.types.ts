export interface BaseRow {
  recKey: number;
  acType: number;
  acRegionDesc: string;
  headingName: string;
  acControlNo: string;
  firstWorker: string;
  inputDate: string;
  lastWorker: string;
}

// 개인형 - 0
export interface PersonalRow extends BaseRow {
  hanjaName: string;
  birthDeathDate: string;
  activityField: string;
  sourceDataFound: string;
}

// 단체형 - 1
export interface CorporationRow extends BaseRow {
  organizationType: string;
  establishmentDate: string;
  terminationDate: string;
  activityField: string;
  sourceDataFound: string;
}

// 지리형 - 5
export interface GeographyRow extends BaseRow {
  sourceDataFound: string;
}

// 주제형 - 4
export interface SubjectRow extends BaseRow {
  sourceDataFound: string;
}

export const authoritySearchTypes = ["0", "1", "5", "4"] as const;

export const authorityNationalities = ["all", "한국", "동양", "서양"] as const;

export const authorityTypeLabels: Record<AuthoritySearchType, string> = {
  "0": "개인명",
  "1": "단체명",
  "5": "지리명",
  "4": "주제명",
};

export const authorityNationalLabels: Record<
  AuthoritySearchNationality,
  string
> = {
  all: "전체",
  한국: "한국",
  동양: "동양",
  서양: "서양",
};

export type AuthoritySearchType = (typeof authoritySearchTypes)[number];

export type AuthoritySearchNationality =
  (typeof authorityNationalities)[number];

export const isAuthoritySearchType = (
  type: string | null,
): type is AuthoritySearchType => {
  return authoritySearchTypes.includes(type as AuthoritySearchType);
};

export const isAuthoritySearchNationality = (
  nationality: string | null,
): nationality is AuthoritySearchNationality => {
  return authorityNationalities.includes(
    nationality as AuthoritySearchNationality,
  );
};

export function parseAuthoritySearchType(
  value: string | null,
): AuthoritySearchType {
  return isAuthoritySearchType(value) ? value : "0";
}

export function parseAuthoritySearchNationality(
  value: string | null,
): AuthoritySearchNationality {
  return isAuthoritySearchNationality(value) ? value : "all";
}
