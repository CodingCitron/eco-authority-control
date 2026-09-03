import z from "zod";

import { apiClient } from "@/lib/axios";
import type { AuthorityDataField } from "@/types/authority-detail.types";

interface FetchAuthoritySeeAlsoParams {
  seeAlsoFields: AuthorityDataField[];
}

export const seeAlsoResponseSchema = z.object({
  data: z.object({
    authority: z.any(),
    addedCount: z.number(),
    skippedControlNos: z.array(z.string()),
  }),
});

export type FetchAuthoritySeeAlsoResponse = z.infer<
  typeof seeAlsoResponseSchema
>;

export async function fetchAuthoritySeeAlso(
  reckey: string,
  data: FetchAuthoritySeeAlsoParams,
) {
  const { data: result } = await apiClient.post<unknown>(
    `/ac/${reckey}/see-also`,
    data,
  );

  return seeAlsoResponseSchema.parse(result);
}
