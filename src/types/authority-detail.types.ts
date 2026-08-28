import z from "zod";

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

/** 전거 상세 데이터 */
export const authorityDetailDataSchema = z.object({
  recKey: z.string(),
  acType: z.string(),
  acControlNo: z.string(),
  acRegionCode: z.string().nullish(),
  activityField: z.string().nullish(),
  hanjaName: z.string().nullish(),
  headingName: z.string().nullish(),
  birthDeathDate: z.string().nullish(),
  firstInputDate: z.string().nullish(),
  firstWorker: z.string().nullish(),
  lastUpdateDate: z.string().nullish(),
  lastWorker: z.string().nullish(),
  record: z.object({
    leader: z.string(),
    controlFields: z.array(authorityControlFieldSchema),
    dataFields: z.array(authorityDataFieldSchema),
  }),
  sourceControlNo: z.string().nullish(),
  sourceDataFound: z.string().nullish(),
});

export type AuthorityControlField = z.infer<typeof authorityControlFieldSchema>;
export type AuthoritySubfield = z.infer<typeof authoritySubfieldSchema>;
export type AuthorityDataField = z.infer<typeof authorityDataFieldSchema>;
export type AuthorityDetailData = z.infer<typeof authorityDetailDataSchema>;

// AuthorityDetailData 비슷한 형태의 미완성 데이터 필요
