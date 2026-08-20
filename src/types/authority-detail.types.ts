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
  acType: z.number().int(),
  leader: z.string(),
  // 서버 응답의 필드명이 control_fields로 내려오므로 그대로 정의한다.
  control_fields: z.array(authorityControlFieldSchema),
  // 서버 응답의 필드명이 data_fields로 내려오므로 그대로 정의한다.
  data_fields: z.array(authorityDataFieldSchema),
});

export type AuthorityControlField = z.infer<typeof authorityControlFieldSchema>;
export type AuthoritySubfield = z.infer<typeof authoritySubfieldSchema>;
export type AuthorityDataField = z.infer<typeof authorityDataFieldSchema>;
export type AuthorityDetailData = z.infer<typeof authorityDetailDataSchema>;
