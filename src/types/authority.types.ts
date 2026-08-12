// 개인형
export interface PersonalRow {
  id: string;
  type: string;
  nationality: string;
  heading: string;
  hanjaName: string;
  years: string;
  field: string;
  source: string;
  controlNumber: string;
  creator: string;
  modifiedBy: string;
}

// 단체형
export interface CorporationRow {
  id: string;
  type: string;
  nationality: string;
  heading: string;
  organizationType: string;
  established: string;
  field: string;
  source: string;
  controlNumber: string;
  creator: string;
  modifiedBy: string;
}

// 지리형
export interface GeographyRow {
  id: string;
  type: string;
  nationality: string;
  heading: string;
  source: string;
  controlNumber: string;
  creator: string;
  modifiedBy: string;
}

// 주제형
export interface SubjectRow {
  id: string;
  type: string;
  nationality: string;
  heading: string;
  source: string;
  note: string;
  controlNumber: string;
  creator: string;
  modifiedBy: string;
}

export const authoritySearchTypes = [
  "personal",
  "corporation",
  "geography",
  "subject",
] as const;

export const authorityNationalities = ["all", "한국", "동양", "서양"] as const;

export const authorityTypeLabels: Record<AuthoritySearchType, string> = {
  personal: "개인명",
  corporation: "단체명",
  geography: "지리명",
  subject: "주제명",
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
  return isAuthoritySearchType(value) ? value : "personal";
}

export function parseAuthoritySearchNationality(
  value: string | null,
): AuthoritySearchNationality {
  return isAuthoritySearchNationality(value) ? value : "all";
}
