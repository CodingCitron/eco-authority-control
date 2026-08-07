import type {
  PersonalRow,
  GeographyRow,
  CorporationRow,
  SubjectRow,
} from "@/components/authority-search-page/authority-search-result.types";
import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { AuthoritySearchType } from "@/types/authority.types";

export interface AuthoritySearchParams {
  type?: AuthoritySearchType | "all"; // 전거 유형
  nationality?: string; // 전거 지역
  controlNumber?: string; // 제어번호 단일 검색어
  heading?: string; // 표목명
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
  const { data } = await apiClient.get<ApiResponse<AuthoritySearchResult[]>>(
    "/authority-search",
    { params },
  );

  if (data?.result?.code !== "Y") {
    throw new Error(data?.result?.message || "전거 검색 요청 실패");
  }

  if (Array.isArray(data?.contents)) {
    return data.contents;
  }

  throw new Error("올바르지 않은 응답 데이터 형식입니다.");
}

// 검색 조건에 따라 데이터 가져오기
