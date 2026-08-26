export const authoritySearchTypes = ["0", "1", "5", "4"] as const;

export const authorityTypeLabels: Record<AuthoritySearchType, string> = {
  "0": "개인명",
  "1": "단체명",
  "5": "지리명",
  "4": "주제명",
};

export type AuthoritySearchType = (typeof authoritySearchTypes)[number];

export function isValidAcType(
  type?: string | null,
): type is AuthoritySearchType {
  return authoritySearchTypes.includes(type as AuthoritySearchType);
}

export const isAuthoritySearchType = (
  type?: string | null,
): type is AuthoritySearchType => {
  return authoritySearchTypes.includes(type as AuthoritySearchType);
};

export function parseAuthoritySearchType(
  value?: string | null,
): AuthoritySearchType {
  return isAuthoritySearchType(value) ? value : "0";
}
