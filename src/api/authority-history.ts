import z from "zod";

import { apiClient } from "@/lib/axios";

export interface AuthorityHistoryQueryParams {
  recKey: string;
  page?: string;
  display?: string;
}

export const authorityHistoryResponseSchema = z.object({
  data: z.object({
    page: z.number(),
    display: z.number(),
    total: z.number(),
    totalPages: z.number(),
    // items: z.array(authorityRecordSchema),
  }),
});

export default async function fetchAuthorityHistory(
  params: AuthorityHistoryQueryParams,
) {
  const { data } = await apiClient.get(`/ac/${params.recKey}/history`, {
    params,
  });

  const result = authorityHistoryResponseSchema.parse(data);

  return result;
}
