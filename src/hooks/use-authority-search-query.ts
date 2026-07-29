import { useQuery } from "@tanstack/react-query";
import {
  fetchAuthoritySearchResults,
  type AuthoritySearchResult,
  type AuthoritySearchParams,
} from "@/api/authority-search";

export const authoritySearchQueryKeys = {
  all: ["authority-search"] as const,
  lists: () => [...authoritySearchQueryKeys.all, "list"] as const,
  list: (params: AuthoritySearchParams) =>
    [...authoritySearchQueryKeys.lists(), params] as const,
};

export function useAuthoritySearchQuery<T extends AuthoritySearchResult>(
  params: AuthoritySearchParams = {},
) {
  return useQuery<T[]>({
    queryKey: authoritySearchQueryKeys.list(params),
    queryFn: () => fetchAuthoritySearchResults(params) as Promise<T[]>,
  });
}
