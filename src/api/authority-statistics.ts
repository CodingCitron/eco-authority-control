import z from "zod";

import { apiClient } from "@/lib/axios";

export interface AuthorityStatisticsQueryParams {
  // 전거유형

  // 등록일자
  from?: string;
  to?: string;

  // 수정일자

  // 수정자
}

export const authorityStatisticsResponseSchema = z.object({
  data: z.object({
    from: z.string(),
    to: z.string(),
    total: z.number(),
    byType: z.array(
      z.object({
        ac_type: z.string(),
        count: z.number(),
      }),
    ),
    byRegion: z.array(
      z.object({
        ac_region_code: z.string(),
        count: z.number(),
      }),
    ),
    operations: z.array(
      z.object({
        operation: z.string(),
        count: z.number(),
      }),
    ),
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
