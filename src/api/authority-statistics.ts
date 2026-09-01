import z from "zod";

import { apiClient } from "@/lib/axios";

export interface AuthorityStatisticsQueryParams {
  // 전거유형
  acType?: string;

  // 등록일자 시작
  createStart?: string;
  // 등록일자 종료
  createEnd?: string;

  // 수정일자 시작
  editStart?: string;
  // 수정일자 종료
  editEnd?: string;

  // 수정자 - 정확히 일치
  lastWorker?: string;
}

export const authorityStatisticsResponseSchema = z.object({
  data: z.object({
    byType: z.array(
      z.object({
        acType: z.string(),
        acTypeName: z.string(),
        count: z.number(),
      }),
    ),
    total: z.number(),
  }),
});

export type AuthorityStatisticsResponse = z.infer<
  typeof authorityStatisticsResponseSchema
>;

export async function fetchAuthorityStatistics(
  params: AuthorityStatisticsQueryParams,
) {
  const { data } = await apiClient.get<unknown>("/ac/statistics", {
    params,
  });

  return authorityStatisticsResponseSchema.parse(data);
}
