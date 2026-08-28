import z from "zod";

const baseRowSchema = z.object({
  recKey: z.string(),
  acRegionCode: z.string().nullish(),
  acRegionDesc: z.string().nullish(),
  headingName: z.string().nullish(),
  acControlNo: z.string(),
  firstWorker: z.string().nullish(),
  firstInputDate: z.string().nullish(),
  lastWorker: z.string().nullish(),
  lastUpdateDate: z.string().nullish(),
});

export const personalRowSchema = baseRowSchema.extend({
  acType: z.literal("0"),
  hanjaName: z.string().nullish(),
  birthDeathDate: z.string().nullish(),
  activityField: z.string().nullish(),
  sourceDataFound: z.string().nullish(),
});

export const corporationRowSchema = baseRowSchema.extend({
  acType: z.literal("1"),
  organizationType: z.string().nullish(),
  establishmentDate: z.string().nullish(),
  terminationDate: z.string().nullish(),
  activityField: z.string().nullish(),
  sourceDataFound: z.string().nullish(),
});

export const geographyRowSchema = baseRowSchema.extend({
  acType: z.literal("5"),
  sourceDataFound: z.string().nullish(),
});

export const subjectRowSchema = baseRowSchema.extend({
  acType: z.literal("4"),
  sourceDataFound: z.string().nullish(),
});

const normalizeAuthorityRecord = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  const row = value as Record<string, unknown>;

  return {
    ...row,
    recKey: row.recKey == null ? row.recKey : String(row.recKey),
    acType: row.acType == null ? row.acType : String(row.acType),
  };
};

export const authorityRecordSchema = z.preprocess(
  normalizeAuthorityRecord,
  z.discriminatedUnion("acType", [
    personalRowSchema,
    corporationRowSchema,
    geographyRowSchema,
    subjectRowSchema,
  ]),
);

export type PersonalRow = z.infer<typeof personalRowSchema>;
export type CorporationRow = z.infer<typeof corporationRowSchema>;
export type GeographyRow = z.infer<typeof geographyRowSchema>;
export type SubjectRow = z.infer<typeof subjectRowSchema>;
export type AuthorityRecord = z.infer<typeof authorityRecordSchema>;
