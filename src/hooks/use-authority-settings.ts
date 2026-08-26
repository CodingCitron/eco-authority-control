import { useQuery } from "@tanstack/react-query";

import { fetchAuthoritySettings } from "@/api/authority-settings";

export const authoritySettingsQueryKeys = {
  all: ["authority-settings"] as const,
};

/** 전거 검색 옵션을 서버 설정에서 조회하고 여러 화면에서 같은 캐시를 공유한다. */
export function useAuthoritySettings() {
  return useQuery({
    queryKey: authoritySettingsQueryKeys.all,
    queryFn: ({ signal }) => fetchAuthoritySettings(signal),
    staleTime: 1000 * 60 * 60,
  });
}
