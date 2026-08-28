import { isIncluded } from "@/utils/type-guards";

export const authoritySearchTypes = ["0", "1", "5", "4"] as const;
export const authorityYesNoValues = ["Y", "N"] as const;

export const authorityTypeLabels: Record<AuthoritySearchType, string> = {
  "0": "개인명",
  "1": "단체명",
  "5": "지리명",
  "4": "주제명",
};

export type AuthoritySearchType = (typeof authoritySearchTypes)[number];
export type AuthorityYesNo = (typeof authorityYesNoValues)[number];

export function isValidAcType(
  type?: string | null,
): type is AuthoritySearchType {
  return isIncluded(authoritySearchTypes, type);
}

export const isAuthoritySearchType = (
  type?: string | null,
): type is AuthoritySearchType => {
  return isIncluded(authoritySearchTypes, type);
};

export function parseAuthoritySearchType(
  value?: string | null,
): AuthoritySearchType {
  return isAuthoritySearchType(value) ? value : "0";
}
