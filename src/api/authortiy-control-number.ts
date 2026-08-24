import z from "zod";

import { apiClient } from "@/lib/axios";
import type { AuthoritySearchType } from "@/types/authority-search.types";

export const generateControlNumberResponseSchema = z.object({
  data: z.string(),
});

export type GenerateControlNumberResponse = z.infer<
  typeof generateControlNumberResponseSchema
>;

export async function fetchGenerateAuthorityControlNumber(
  acType: AuthoritySearchType,
): Promise<GenerateControlNumberResponse> {
  const { data } = await apiClient.get<unknown>(
    `/ac/control-numbers/next`,
    {
      params: {
        acType,
      },
    },
  );

  return generateControlNumberResponseSchema.parse(data);
}
