import { apiClient } from "@/lib/axios";

import { authorityIntegrateResultSchema } from "@/types/authority-detail.types";
import type { AuthorityYesNo } from "@/types/authority.types";
import type { MarcEditorRecord } from "@/types/marc-editor.types";

export interface AuthorityIntegrateRequestQueryParams {
  sourceRecKey: string;
  targetRecKey: string;
  acRegionCode: string;
  birthDeathDatePrivateYn: AuthorityYesNo;
  biographyPrivateYn: AuthorityYesNo;
  copyrightBlanketAgreeYn: AuthorityYesNo;
  copyrightBlanketAgreeDate: string;
  record: MarcEditorRecord & {
    leader: string;
  };
}

export async function fetchAuthorityIntegrate(
  params: AuthorityIntegrateRequestQueryParams,
) {
  const { data } = await apiClient.post<unknown>("/ac/integrate", {
    params,
  });

  return authorityIntegrateResultSchema.parse(data);
}
