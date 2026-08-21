import { z } from "zod";

import { apiClient } from "@/lib/axios";

export const authorityDeleteResponseSchema = z.object({
  data: z.object({
    recKey: z.string(),
    deleted: z.boolean(),
  }),
});

export async function AuthorityDelete(reckey: string) {
  const { data } = await apiClient.delete(`/ac/${reckey}`);

  const result = authorityDeleteResponseSchema.parse(data);

  return result;
}
