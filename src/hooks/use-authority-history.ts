import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import type {
  AuthorityHistoryQueryParams,
  AuthorityHistoryResponse,
} from "@/api/authority-history";
import fetchAuthorityHistory from "@/api/authority-history";

export const authorityHistoryQueryKeys = {
  all: ["authority-history"] as const,
  detail: (params: AuthorityHistoryQueryParams) =>
    [...authorityHistoryQueryKeys.all, "detail", params] as const,
};

export function useAuthorityHistory<
  TData = AuthorityHistoryResponse,
  TSelected = TData,
>(
  params: AuthorityHistoryQueryParams,
  options?: Omit<
    UseQueryOptions<TData, Error, TSelected>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: authorityHistoryQueryKeys.detail(params),
    queryFn: () => fetchAuthorityHistory(params) as Promise<TData>,
    ...options,
  });
}
