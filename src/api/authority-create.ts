import { apiClient } from "@/lib/axios";

import type { MarcEditorRecord } from "@/types/marc-editor.types";
import type { AuthorityYesNo } from "@/types/authority.types";

import { authorityDetailResponseSchema } from "./authority-detail";

export interface AuthorityCreateQueryParams {
  leaderStatus: string;
  leaderType: string;
  leaderInputLevel: string;
  acRegionCode: string;
  biographyPrivateYn: AuthorityYesNo;
  copyrightBlanketAgreeYn: AuthorityYesNo;
  copyrightBlanketAgreeDate?: string;
  record: MarcEditorRecord;
}

export async function fetchAuthorityCreate(params: AuthorityCreateQueryParams) {
  const { data } = await apiClient.post<unknown>("/ac", params);
  return authorityDetailResponseSchema.parse(data);
}
