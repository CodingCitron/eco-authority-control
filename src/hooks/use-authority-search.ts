import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import type { AuthorityRecord } from "@/types/authority-search.types";
import {
  isValidAcType,
  type AuthoritySearchType,
} from "@/types/authority.types";

import {
  fetchAuthoritySearch,
  type AuthoritySearchQueryParams,
  type AuthoritySearchResponse,
} from "@/api/authority-search";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";

export const authoritySearchQueryKeys = {
  all: ["authority-search"] as const,
  lists: () => [...authoritySearchQueryKeys.all, "list"] as const,
  list: (params: AuthoritySearchQueryParams) =>
    [...authoritySearchQueryKeys.lists(), params] as const,
};

export function useAuthoritySearch<
  TData = AuthoritySearchResponse,
  TSelected = TData,
>(
  params: AuthoritySearchQueryParams,
  options?: Omit<
    UseQueryOptions<TData, Error, TSelected>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<TData, Error, TSelected>({
    queryKey: authoritySearchQueryKeys.list(params),
    queryFn: ({ signal }) =>
      fetchAuthoritySearch(params, signal) as Promise<TData>,
    ...options,
  });
}

export function getAuthoritySearchState(searchParams: URLSearchParams) {
  const acType = searchParams.get("acType");
  const rawAcRegionCode = searchParams.get("acRegionCode");
  const acRegionCode = rawAcRegionCode === "all" ? "0" : rawAcRegionCode;
  const acControlNo = searchParams.get("acControlNo")?.trim();
  const searchKeyword = searchParams.get("searchKeyword")?.trim();
  const searchType = searchParams.get("searchType")?.trim();
  const params: AuthoritySearchQueryParams = {
    searchKeyword: searchKeyword || undefined,
    searchType: searchType || undefined,
    acRegionCode: acRegionCode || undefined,
    acType: acType || "0",
    acControlNo: acControlNo || undefined,
    page: searchParams.get("page") || "1",
    display: searchParams.get("display") || "20",
  };

  const isSearched = Boolean(
    isValidAcType(acType) ||
      (acRegionCode && acRegionCode !== "0") ||
      acControlNo ||
      searchKeyword ||
      searchType,
  );

  return {
    params,
    isSearched,
  };
}

export function useCurrentAuthoritySearchParams() {
  const [searchParams] = useSearchParams();

  return getAuthoritySearchState(searchParams);
}

type AuthoritySearchQueryOptions<TSelected> = Omit<
  UseQueryOptions<AuthoritySearchResponse, Error, TSelected>,
  "queryKey" | "queryFn" | "enabled"
> & {
  enabled?: boolean;
};

// 현재 검색된 전거 데이터
export function useCurrentAuthoritySearch<TSelected = AuthoritySearchResponse>(
  options?: AuthoritySearchQueryOptions<TSelected>,
) {
  const { params, isSearched } = useCurrentAuthoritySearchParams();

  const queryResult = useAuthoritySearch<AuthoritySearchResponse, TSelected>(
    params,
    {
      ...options,
      enabled: isSearched && (options?.enabled ?? true),
    },
  );

  const acType: AuthoritySearchType | "" = isValidAcType(params.acType)
    ? params.acType
    : "0";

  return {
    ...queryResult,
    acType: acType,
    isSearched,
  };
}

// 선택된 전거 데이터 가져오기
export function useAuthoritySearchByRecordKeys() {
  const { selectedRecordKeys } = useSearchPage();

  return useCurrentAuthoritySearch<AuthorityRecord[]>({
    enabled: false,
    select: useCallback(
      ({ data }) => {
        const items = data.items;

        return selectedRecordKeys
          .map((recordKey) =>
            items.find((record) => record.recKey === recordKey),
          )
          .filter((record): record is AuthorityRecord => record !== undefined);
      },
      [selectedRecordKeys],
    ),
    refetchOnMount: false,
  });
}
