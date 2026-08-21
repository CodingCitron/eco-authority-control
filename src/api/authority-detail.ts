import z from "zod";

import { apiClient } from "@/lib/axios";
import { authorityDetailDataSchema } from "@/types/authority-detail.types";

export const authorityDetailResponseSchema = z.object({
  data: authorityDetailDataSchema,
});

export type AuthorityDetailResponse = z.infer<
  typeof authorityDetailResponseSchema
>;

// 전거 데이터 상세 정보 조회
export async function fetchAuthorityDetail(reckey: string) {
  const { data } = await apiClient.get<AuthorityDetailResponse>(
    `/ac/${reckey}`,
  );

  const result = authorityDetailResponseSchema.parse(data);

  return result;
}
