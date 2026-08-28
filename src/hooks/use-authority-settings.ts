import { useQuery } from "@tanstack/react-query";

import { fetchAuthoritySettings } from "@/api/authority-settings";
import queryClient from "@/lib/query-client";

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

export async function getRegionDesc(regionCode: string) {
  try {
    const data = await queryClient.query({
      queryKey: authoritySettingsQueryKeys.all,
      queryFn: () => fetchAuthoritySettings(),
    });

    if (regionCode in data?.data.REGION_CODE) {
      return data.data.REGION_CODE[regionCode];
    }

    return regionCode;
  } catch (error) {
    console.error(error);

    return regionCode;
  }
}
