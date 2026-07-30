import { useCallback } from "react";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  fetchAuthoritySearchResults,
  type AuthoritySearchResult,
  type AuthoritySearchParams,
} from "@/api/authority-search";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";

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

// 선택된 전거 가져오기
export function useAuthoritySearchByControlNumbersQuery(isOpen: boolean) {
  const { currentTab, selectedControlNumbers } = useSearchPage();

  const query = useAuthoritySearchQuery<AuthoritySearchResult>(
    { type: currentTab.authorityType },
    {
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
    },
  );

  return {
    ...query,
    data: isOpen ? query.data : undefined,
  };
}
