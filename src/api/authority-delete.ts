import { z } from "zod";

import { apiClient } from "@/lib/axios";

export const authorityDeleteResponseSchema = z.object({
  data: z.object({
    recKey: z.string(),
    deleted: z.boolean(),
  }),
});

export async function deleteAuthorityRecord(reckey: string) {
  const { data } = await apiClient.delete<unknown>(`/ac/${reckey}`);
  return authorityDeleteResponseSchema.parse(data);
}
