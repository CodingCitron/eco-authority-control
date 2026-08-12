import type {
  PersonalRow,
  GeographyRow,
  CorporationRow,
  SubjectRow,
} from "@/types/authority-search.types";
import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";

export interface AuthoritySearchParams {
  type?: string; // 전거 유형
  nationality?: string; // 전거 지역
  controlNumber?: string; // 제어번호 단일 검색어
  heading?: string; // 표목명
  page?: number; // 페이지
  pageSize?: number; // 표시 개수
}

export type AuthorityRecord =
  | PersonalRow
  | CorporationRow
  | GeographyRow
  | SubjectRow;

export type AuthoritySearchResponse<T> = {
  data: {
    page: number;
    display: number;
    total: number; // totalCount
    totalPages: number;
    items: T[];
  };
};

export type AuthoritySearchResult = AuthorityRecord;

export async function fetchAuthoritySearch(
  params: AuthoritySearchParams,
): Promise<AuthoritySearchResponse<AuthorityRecord>> {
  const { data } = await apiClient.get<
    ApiResponse<AuthoritySearchResponse<AuthorityRecord>>
  >("/ac/search", { params });

  if (data?.result?.code !== "Y") {
    throw new Error(data?.result?.message || "전거 검색 요청 실패");
  }

  if (
    typeof data?.contents?.data?.total === "number" &&
    Array.isArray(data.contents.data.items)
  ) {
    return data.contents;
  }

  throw new Error("올바르지 않은 응답 데이터 형식입니다.");
}

// 검색 조건에 따라 데이터 가져오기
