import z from "zod";

import { apiClient } from "@/lib/axios";
import {
  authorityControlFieldSchema,
  authorityDataFieldSchema,
} from "@/types/authority-detail.types";

export interface AuthorityHistoryQueryParams {
  recKey: string;
  page?: string;
  display?: string;
}

export const authorityHistoryResponseSchema = z.object({
  data: z.object({
    display: z.number(),
    page: z.number(),
    total: z.number(),
    totalPages: z.number(),
    items: z.array(
      z.object({
        recKey: z.string(),
        historyKey: z.string(),
        operation: z.string(),
        record: z.object({
          leader: z.string(),
          controlFields: z.array(authorityControlFieldSchema),
          dataFields: z.array(authorityDataFieldSchema),
        }),
      }),
    ),
  }),
});

export type AuthorityHistoryResponse = z.infer<
  typeof authorityHistoryResponseSchema
>;

export default async function fetchAuthorityHistory(
  params: AuthorityHistoryQueryParams,
) {
  const { data } = await apiClient.get<unknown>(
    `/ac/${params.recKey}/history`,
    {
      params,
    },
  );

  return authorityHistoryResponseSchema.parse(data);
}
