import type {
  PersonalRow,
  GeographyRow,
  CorporationRow,
  SubjectRow,
} from "@/types/authority-search.types";
import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";

export interface AuthoritySearchQueryParams {
  searchKeyword?: string; // 전거 표목 검색 키워드
  searchType?: string; // 키워드 적용 유형
  acRegionCode?: string; // 전거 지역 코드
  acControlNo?: string; // 제어번호 단일 검색어
  acType?: string; // 전거 유형
  page?: string; // 페이지
  display?: string; // 표시 개수
}

export type AuthorityRecord =
  | PersonalRow
  | CorporationRow
  | GeographyRow
  | SubjectRow;

export type AuthoritySearchResponse = {
  data: {
    page: number;
    display: number;
    total: number; // totalCount
    totalPages: number;
    items: AuthorityRecord[];
  };
};

export type AuthoritySearchResult = AuthorityRecord;

export async function fetchAuthoritySearch(
  params: AuthoritySearchQueryParams,
): Promise<AuthoritySearchResponse> {
  const { data } = await apiClient.get<AuthoritySearchResponse>("/ac/search", {
    params,
  });

  console.log(data);

  if (typeof data?.data?.total === "number" && Array.isArray(data.data.items)) {
    return data;
  }

  throw new Error("올바르지 않은 응답 데이터 형식입니다.");
}

// 검색 조건에 따라 데이터 가져오기
