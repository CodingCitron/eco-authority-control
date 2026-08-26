import z from "zod";

import { apiClient } from "@/lib/axios";

export const authoritySettingsResponseSchema = z.object({
  data: z.object({
    TRUNCATION_TYPE: z.object({
      EXACT: z.string(),
      PREFIX: z.string(),
      SUFFIX: z.string(),
      CONTAINS: z.string(),
    }),
    REGION_CODE: z.record(z.string(), z.string()),
  }),
});

export type AuthoritySettingsResponse = z.infer<
  typeof authoritySettingsResponseSchema
>;

export async function fetchAuthoritySettings(
  signal?: AbortSignal,
): Promise<AuthoritySettingsResponse> {
  const { data } = await apiClient.get<unknown>("/cfg/settings", { signal });

  return authoritySettingsResponseSchema.parse(data);
}
