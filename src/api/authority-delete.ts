import { z } from "zod";

import { apiClient } from "@/lib/axios";

const deleteItemSchema = z.object({
  recKey: z.string(),
  deleted: z.boolean(),
});

export const authorityDeleteResponseSchema = z.object({
  data: deleteItemSchema,
});

export const authorityDeleteAllResponseSchema = z.object({
  data: z.object({
    items: deleteItemSchema.array(),
  }),
});

export async function fetchDeleteAuthorityRecord(reckey: string) {
  const { data } = await apiClient.delete<unknown>(`/ac/${reckey}`);
  return authorityDeleteResponseSchema.parse(data);
}

export async function fetchDeleteAuthorityRecords(recKeys: string[]) {
  const { data } = await apiClient.delete<unknown>(`/ac`, {
    data: {
      recKeys,
    },
  });
  return authorityDeleteAllResponseSchema.parse(data);
}
