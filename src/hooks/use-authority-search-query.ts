import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import type { AuthorityRecord } from "@/types/authority-search.types";

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

export function useAuthoritySearchQuery<
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
    queryFn: () => fetchAuthoritySearch(params) as Promise<TData>,
    ...options,
  });
}

export function useCurrentAuthoritySearchParams() {
  const [searchParams] = useSearchParams();

  const params: AuthoritySearchQueryParams = {
    searchKeyword: searchParams.get("searchKeyword") || "",
    searchType: searchParams.get("searchType") || "",
    acRegionCode: searchParams.get("acRegionCode") || "",
    acControlNo: searchParams.get("acControlNo") || "",
    acType: searchParams.get("acType") || "",
    page: searchParams.get("page") || "1",
    display: searchParams.get("display") || "10",
  };

  const isSearched = Boolean(searchParams.get("isSearched"));

  return {
    params,
    isSearched,
  };
}

type AuthoritySearchQueryOptions<TSelected> = Omit<
  UseQueryOptions<AuthoritySearchResponse, Error, TSelected>,
  "queryKey" | "queryFn"
>;

// 현재 검색된 전거 데이터
export function useCurrentAuthoritySearchQuery<
  TSelected = AuthoritySearchResponse,
>(options?: AuthoritySearchQueryOptions<TSelected>) {
  const { params, isSearched } = useCurrentAuthoritySearchParams();

  const queryResult = useAuthoritySearchQuery<
    AuthoritySearchResponse,
    TSelected
  >(params, {
    enabled: isSearched,
    ...options,
  });

  return {
    ...queryResult,
    acType: params.acType,
    isSearched,
  };
}

// 선택된 전거 데이터 가져오기
export function useAuthoritySearchByControlNumbersQuery() {
  const { selectedControlNumbers } = useSearchPage();

  return useCurrentAuthoritySearchQuery<AuthorityRecord[]>({
    enabled: false,
    select: useCallback(
      ({ data }) => {
        const items = data.items;

        return selectedControlNumbers
          .map((controlNumber) =>
            items.find((record) => record.acControlNo === controlNumber),
          )
          .filter((record): record is AuthorityRecord => record !== undefined);
      },
      [selectedControlNumbers],
    ),
    refetchOnMount: false,
  });
}
