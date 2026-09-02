import z from "zod";

import { authorityYesNoValues } from "@/types/authority.types";

/** 제어 필드(001, 005, 008 등) */
export const authorityControlFieldSchema = z.object({
  tag: z.string(),
  value: z.string(),
});

/** 가변 필드의 식별기호 */
export const authoritySubfieldSchema = z.object({
  code: z.string(),
  value: z.string(),
});

/** 가변 필드(046, 100, 370 등) */
export const authorityDataFieldSchema = z.object({
  tag: z.string(),
  ind1: z.string(),
  ind2: z.string(),
  subfields: z.array(authoritySubfieldSchema),
});

export const recordSchema = z.object({
  leader: z.string(),
  controlFields: z.array(authorityControlFieldSchema),
  dataFields: z.array(authorityDataFieldSchema),
});

/** 전거 상세 데이터 */
export const authorityDetailDataSchema = z.object({
  recKey: z.string(),
  acType: z.string(),
  acControlNo: z.string(),
  acRegionCode: z.string().nullish(),
  acRegionDesc: z.string().nullish(),
  activityField: z.string().nullish(),
  biographyPrivateYn: z.enum(authorityYesNoValues).nullish(),
  hanjaName: z.string().nullish(),
  headingName: z.string().nullish(),
  birthDeathDate: z.string().nullish(),
  birthDeathDatePrivateYn: z.enum(authorityYesNoValues).nullish(),
  copyrightBlanketAgreeYn: z.enum(authorityYesNoValues).nullish(),
  copyrightBlanketAgreeDate: z.string().nullish(),
  firstInputDate: z.string().nullish(),
  firstWorker: z.string().nullish(),
  lastUpdateDate: z.string().nullish(),
  lastWorker: z.string().nullish(),
  record: recordSchema,
  sourceControlNo: z.string().nullish(),
  sourceDataFound: z.string().nullish(),
});

/** 전거 통합 결과 */
const authorityTargetSchema = z
  .looseObject({
    acControlNo: z.string(),
    acRegionCode: z.string(),
    acRegionDesc: z.string(),
    birthDeathDatePrivateYn: z.enum(authorityYesNoValues).nullish(),
    biographyPrivateYn: z.enum(authorityYesNoValues).nullish(),
    copyrightBlanketAgreeYn: z.enum(authorityYesNoValues).nullish(),
    copyrightBlanketAgreeDate: z.string(),
    record: recordSchema,
  })
  .transform((value) => value);

export const authorityIntegrateResultSchema = z.object({
  sourceRecKey: z.string(),
  integrated: z.boolean(),
  target: z.any(),
});

export type AuthorityControlField = z.infer<typeof authorityControlFieldSchema>;
export type AuthoritySubfield = z.infer<typeof authoritySubfieldSchema>;
export type AuthorityDataField = z.infer<typeof authorityDataFieldSchema>;
export type AuthorityDetailData = z.infer<typeof authorityDetailDataSchema>;
export type AuthorityIntegrateResult = z.infer<
  typeof authorityIntegrateResultSchema
>;
