import {
  fetchAuthorityDetail,
  type AuthorityDetailResponse,
} from "@/api/authority-detail";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const authorityDetailKeys = {
  all: ["authority-detail"] as const,
  detail: (recKey: string) =>
    [...authorityDetailKeys.all, "detail", recKey] as const,
};

export function useAuthorityDetail<
  TData = AuthorityDetailResponse,
  TSelected = TData,
>(
  recKey: string,
  options?: Omit<
    UseQueryOptions<TData, Error, TSelected>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<TData, Error, TSelected>({
    queryKey: authorityDetailKeys.detail(recKey),
    queryFn: () => fetchAuthorityDetail(recKey) as Promise<TData>,
    enabled: Boolean(recKey),
    ...options,
  });
}
