import z from "zod";

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

const baseRowSchema = z.object({
  recKey: z.string(),
  acRegionDesc: z.string(),
  headingName: z.string(),
  acControlNo: z.string(),
  firstWorker: z.string(),
  inputDate: z.string(),
  lastWorker: z.string(),
});

export const personalRowSchema = baseRowSchema.extend({
  acType: z.literal("0"),
  hanjaName: z.string(),
  birthDeathDate: z.string(),
  activityField: z.string(),
  sourceDataFound: z.string(),
});

export const corporationRowSchema = baseRowSchema.extend({
  acType: z.literal("1"),
  organizationType: z.string(),
  establishmentDate: z.string(),
  terminationDate: z.string().nullable(),
  activityField: z.string(),
  sourceDataFound: z.string(),
});

export const geographyRowSchema = baseRowSchema.extend({
  acType: z.literal("5"),
  sourceDataFound: z.string(),
});

export const subjectRowSchema = baseRowSchema.extend({
  acType: z.literal("4"),
  sourceDataFound: z.string(),
});

export const authorityRecordSchema = z.discriminatedUnion("acType", [
  personalRowSchema,
  corporationRowSchema,
  geographyRowSchema,
  subjectRowSchema,
]);

export type PersonalRow = z.infer<typeof personalRowSchema>;
export type CorporationRow = z.infer<typeof corporationRowSchema>;
export type GeographyRow = z.infer<typeof geographyRowSchema>;
export type SubjectRow = z.infer<typeof subjectRowSchema>;
export type AuthorityRecord = z.infer<typeof authorityRecordSchema>;

export type AuthoritySearchNationality =
  (typeof authorityNationalities)[number];

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

export const isAuthoritySearchNationality = (
  nationality?: string | null,
): nationality is AuthoritySearchNationality => {
  return authorityNationalities.includes(
    nationality as AuthoritySearchNationality,
  );
};

export function parseAuthoritySearchType(
  value?: string | null,
): AuthoritySearchType {
  return isAuthoritySearchType(value) ? value : "0";
}

export function parseAuthoritySearchNationality(
  value?: string | null,
): AuthoritySearchNationality {
  return isAuthoritySearchNationality(value) ? value : "all";
}
