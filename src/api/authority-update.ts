import { apiClient } from "@/lib/axios";

import type { AuthorityYesNo } from "@/types/authority.types";
import type { MarcEditorRecord } from "@/types/marc-editor.types";

import { authorityDetailResponseSchema } from "./authority-detail";

export interface AuthorityUpdateQueryParams {
  recKey: string;
  leaderStatus: string;
  leaderType: string;
  leaderInputLevel: string;
  acRegionCode: string;
  birthDeathDatePrivateYn: AuthorityYesNo;
  biographyPrivateYn: AuthorityYesNo;
  copyrightBlanketAgreeYn: AuthorityYesNo;
  copyrightBlanketAgreeDate?: string;
  record: MarcEditorRecord & {
    leader: string;
  };
}

// 전거 수정
export async function fetchAuthorityUpdate({
  recKey,
  ...params
}: AuthorityUpdateQueryParams) {
  const { data } = await apiClient.put<unknown>(`/ac/${recKey}`, params);
  return authorityDetailResponseSchema.parse(data);
}
