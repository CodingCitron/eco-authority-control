import { apiClient } from "@/lib/axios";
import type {
  PersonalRow,
  GeographyRow,
  CorporationRow,
  SubjectRow,
} from "@/components/authority-search-page/authority-search-result.types";

export type AuthoritySearchType =
  | "personal"
  | "corporation"
  | "geography"
  | "subject";

export interface AuthoritySearchParams {
  type?: AuthoritySearchType;
  nationality?: string;
  controlNumber?: string;
  controlNumbers?: readonly string[];
  heading?: string;
}

export type AuthoritySearchResult =
  | PersonalRow
  | CorporationRow
  | GeographyRow
  | SubjectRow;

export const authorityTypeLabels: Record<AuthoritySearchType, string> = {
  personal: "개인명",
  corporation: "단체명",
  geography: "지리명",
  subject: "주제명",
};

export async function fetchAuthoritySearchResults(
  params: AuthoritySearchParams,
): Promise<AuthoritySearchResult[]> {
  const { data } = await apiClient.get<AuthoritySearchResult[]>(
    "/authority-search",
    { params },
  );

  return data;
}

// 검색 조건에 따라 데이터 가져오기
