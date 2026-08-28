import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import {
  fetchAuthorityStatistics,
  type AuthorityStatisticsQueryParams,
  type AuthorityStatisticsResponse,
} from "@/api/authority-statistics";
import { isValidAcType } from "@/types/authority.types";

export const authorityStatisticsKeys = {
  all: ["authority-statistics"] as const,
  statistics: (params: AuthorityStatisticsQueryParams) => [
    ...authorityStatisticsKeys.all,
    "statistics",
    params,
  ],
};

export function getAuthorityStatisticsSearchState(
  searchParams: URLSearchParams,
) {
  const acType = searchParams.get("acType");
  const regDateFrom = searchParams.get("regDateFrom")?.trim();
  const regDateTo = searchParams.get("regDateTo")?.trim();
  const modDateFrom = searchParams.get("modDateFrom")?.trim();
  const modDateTo = searchParams.get("modDateTo")?.trim();
  const editor = searchParams.get("editor")?.trim();
  const params: AuthorityStatisticsQueryParams = {
    from: regDateFrom || undefined,
    to: regDateTo || undefined,
  };

  return {
    params,
    isSearched: Boolean(
      acType === "all" ||
        isValidAcType(acType) ||
        regDateFrom ||
        regDateTo ||
        modDateFrom ||
        modDateTo ||
        editor,
    ),
  };
}

export function useAuthorityStatistics<
  TData = AuthorityStatisticsResponse,
  TSelected = TData,
>(
  params: AuthorityStatisticsQueryParams,
  options?: Omit<
    UseQueryOptions<TData, Error, TSelected>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<TData, Error, TSelected>({
    queryKey: authorityStatisticsKeys.statistics(params),
    queryFn: () => fetchAuthorityStatistics(params) as Promise<TData>,
    ...options,
  });
}

type AuthorityStatisticsQueryOptions<TSelected> = Omit<
  UseQueryOptions<AuthorityStatisticsResponse, Error, TSelected>,
  "queryKey" | "queryFn" | "enabled"
>;

/** URL에 적용된 구축현황 조건으로 조회하며, 조회 버튼을 누르기 전에는 실행하지 않는다. */
export function useCurrentAuthorityStatistics<
  TSelected = AuthorityStatisticsResponse,
>(options?: AuthorityStatisticsQueryOptions<TSelected>) {
  const [searchParams] = useSearchParams();
  const { params, isSearched } =
    getAuthorityStatisticsSearchState(searchParams);
  const queryResult = useAuthorityStatistics<
    AuthorityStatisticsResponse,
    TSelected
  >(params, {
    ...options,
    enabled: isSearched,
  });

  return {
    ...queryResult,
    isSearched,
  };
}
