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
) {
  const { data } = await apiClient.get<GenerateControlNumberResponse>(
    `/ac/control-numbers/next`,
    {
      params: {
        acType,
      },
    },
  );

  const result = generateControlNumberResponseSchema.parse(data);

  return result;
}
