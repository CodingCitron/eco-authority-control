import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import {
  fetchAuthorityStatistics,
  type AuthorityStatisticsQueryParams,
  type AuthorityStatisticsResponse,
} from "@/api/authority-statistics";

export const authorityStatisticsKeys = {
  all: ["authority-statistics"] as const,
  statistics: (params: AuthorityStatisticsQueryParams) => [
    ...authorityStatisticsKeys.all,
    "statistics",
    params,
  ],
};

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
