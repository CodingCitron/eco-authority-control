import z from "zod";
import { apiClient } from "@/lib/axios";

import { authorityIntegrateResultSchema } from "@/types/authority-detail.types";
import type { AuthorityYesNo } from "@/types/authority.types";
import type { MarcEditorRecord } from "@/types/marc-editor.types";

export interface AuthorityIntegrateRequestQueryParams {
  sourceRecKey: number;
  targetRecKey: number;
  acRegionCode?: string;
  birthDeathDatePrivateYn?: AuthorityYesNo;
  biographyPrivateYn?: AuthorityYesNo;
  copyrightBlanketAgreeYn?: AuthorityYesNo;
  copyrightBlanketAgreeDate?: string;
  record: MarcEditorRecord & {
    leader: string;
  };
}

export const authorityIntegrateResponseSchema = z.object({
  data: authorityIntegrateResultSchema,
});

export async function fetchAuthorityIntegrate(
  params: AuthorityIntegrateRequestQueryParams,
) {
  const { data } = await apiClient.post<unknown>("/ac/integrate", params);

  return authorityIntegrateResponseSchema.parse(data);
}
