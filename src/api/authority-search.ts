import z from "zod";

import { apiClient } from "@/lib/axios";
import { authorityRecordSchema } from "@/types/authority-search.types";

export interface AuthoritySearchQueryParams {
  searchKeyword?: string; // 전거 표목 검색 키워드
  searchType?: string; // 키워드 적용 유형
  acRegionCode?: string; // 전거 지역 코드
  acControlNo?: string; // 제어번호 단일 검색어
  acType?: string; // 전거 유형
  page?: string; // 페이지
  display?: string; // 표시 개수
}

export const authoritySearchResponseSchema = z.object({
  data: z.object({
    page: z.number(),
    display: z.number(),
    total: z.number(),
    totalPages: z.number(),
    items: z.array(authorityRecordSchema),
  }),
});

export type AuthoritySearchResponse = z.infer<
  typeof authoritySearchResponseSchema
>;

export async function fetchAuthoritySearch(
  params: AuthoritySearchQueryParams,
  signal?: AbortSignal,
): Promise<AuthoritySearchResponse> {
  const { data } = await apiClient.get<unknown>("/ac/search", {
    params,
    signal,
  });

  return authoritySearchResponseSchema.parse(data);
}
