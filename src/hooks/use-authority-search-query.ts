import { useCallback } from "react";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import {
  fetchAuthoritySearch,
  type AuthoritySearchParams,
  type AuthorityRecord,
  type AuthoritySearchResponse,
} from "@/api/authority-search";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";
import { useSearchParams } from "react-router";

export const authoritySearchQueryKeys = {
  all: ["authority-search"] as const,
  lists: () => [...authoritySearchQueryKeys.all, "list"] as const,
  list: (params: AuthoritySearchParams) =>
    [...authoritySearchQueryKeys.lists(), params] as const,
};

export function useAuthoritySearchQuery<
  TData = AuthoritySearchResponse,
  TSelected = TData,
>(
  params: AuthoritySearchParams,
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
    type: params.type,
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
        console.log(data);
        return selectedControlNumbers
          .map((controlNumber) =>
            data.find((record) => record.controlNumber === controlNumber),
          )
          .filter((record): record is AuthorityRecord => record !== undefined);
      },
      [selectedControlNumbers],
    ),
    refetchOnMount: false,
  });
}
