import { apiClient } from "@/lib/axios";
import type { MarcEditorRecord } from "@/types/marc-editor.types";

export interface AuthorityUpdateQueryParams {
  recKey: string;
  acRegionCode?: string;
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
  return data;
}
