import {
  fetchAuthorityDetail,
  type AuthorityDetailResponse,
} from "@/api/authority-detail";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const authorityDetailKeys = {
  all: ["authority-detail"] as const,
  detail: (reckey: string) => [...authorityDetailKeys.all, reckey] as const,
};

export function useAuthorityDetail<
  TData = AuthorityDetailResponse,
  TSelected = TData,
>(
  reckey: string,
  options?: Omit<
    UseQueryOptions<TData, Error, TSelected>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<TData, Error, TSelected>({
    queryKey: authorityDetailKeys.detail(reckey),
    queryFn: () => fetchAuthorityDetail(reckey) as Promise<TData>,
    ...options,
  });
}
