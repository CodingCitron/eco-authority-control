import { useCallback } from "react";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import {
  fetchAuthoritySearchResults,
  type AuthoritySearchResult,
  type AuthoritySearchParams,
} from "@/api/authority-search";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";
import { useSearchParams } from "react-router";

export const authoritySearchQueryKeys = {
  all: ["authority-search"] as const,
  lists: () => [...authoritySearchQueryKeys.all, "list"] as const,
  list: (params: AuthoritySearchParams) =>
    [...authoritySearchQueryKeys.lists(), params] as const,
};

export function useAuthoritySearchQuery<T extends AuthoritySearchResult>(
  params: AuthoritySearchParams = {},
  options?: Omit<UseQueryOptions<T[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery<T[]>({
    queryKey: authoritySearchQueryKeys.list(params),
    queryFn: () => fetchAuthoritySearchResults(params) as Promise<T[]>,
    ...options,
  });
}

export function useCurrentAuthoritySearchParams() {
  const [searchParams] = useSearchParams();

  const params: AuthoritySearchParams = {
    type: searchParams.get("type") || "",
    nationality: searchParams.get("nationality") || "",
    controlNumber: searchParams.get("controlNumber") || "",
    heading: searchParams.get("heading") || "",
  };

  const isSearched = Boolean(searchParams.get("isSearched"));

  return {
    params,
    isSearched,
  };
}

// 현재 검색된 전거 데이터
export function useCurrentAuthoritySearchQuery<
  T extends AuthoritySearchResult = AuthoritySearchResult,
>(options?: Omit<UseQueryOptions<T[], Error>, "queryKey" | "queryFn">) {
  const { params, isSearched } = useCurrentAuthoritySearchParams();

  const queryResult = useAuthoritySearchQuery<T>(params, {
    enabled: isSearched,
    ...options,
  });

  return {
    ...queryResult,
    type: params.type,
    isSearched,
  };
}

// 선택된 전거 데이터 가져오기
export function useAuthoritySearchByControlNumbersQuery() {
  const { selectedControlNumbers } = useSearchPage();

  return useCurrentAuthoritySearchQuery<AuthoritySearchResult>({
    enabled: false,
    select: useCallback(
      (data) =>
        selectedControlNumbers
          .map((controlNumber) =>
            data.find((record) => record.controlNumber === controlNumber),
          )
          .filter(
            (record): record is AuthoritySearchResult => record !== undefined,
          ),
      [selectedControlNumbers],
    ),
    refetchOnMount: false,
  });
}
