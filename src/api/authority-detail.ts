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
export async function fetchAuthorityDetail(recKey: string) {
  const { data } = await apiClient.get<unknown>(`/ac/${recKey}`);

  return authorityDetailResponseSchema.parse(data);
}
