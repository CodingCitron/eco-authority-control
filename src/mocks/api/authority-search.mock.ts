import { http } from "msw";

import { authoritySearchMockData } from "@/mocks/data/authority-search.data";
import { isAuthoritySearchType } from "@/types/authority-search.types";
import type { AuthoritySearchQueryParams } from "@/api/authority-search";
import { createApiResponse } from "@/mocks/utils";

function parseQueryParams(request: Request): AuthoritySearchQueryParams {
  const params = new URL(request.url).searchParams;

  return {
    searchKeyword: params.get("searchKeyword") || undefined,
    searchType: params.get("searchType") || undefined,
    acRegionCode: params.get("acRegionCode") || undefined,
    acType: params.get("acType") || "0",
    acControlNo: params.get("acControlNo") || undefined,
    page: params.get("page") || "1",
    display: params.get("display") || "20",
  };
}

export const authoritySearchHandlers = [
  http.get("/api/ac/search", ({ request }) => {
    const query = parseQueryParams(request);
    const filteredRows = authoritySearchMockData.filter((row) => {
      if (
        query.acType &&
        isAuthoritySearchType(query.acType) &&
        row.acType !== query.acType
      ) {
        return false;
      }

      if (
        query.acRegionCode &&
        query.acRegionCode !== "all" &&
        row.acRegionDesc !== query.acRegionCode
      ) {
        return false;
      }

      if (query.acControlNo && !row.acControlNo.includes(query.acControlNo)) {
        return false;
      }

      if (
        query.searchKeyword &&
        !(row.headingName ?? "").includes(query.searchKeyword)
      ) {
        return false;
      }

      return true;
    });

    const page = Math.max(Number(query.page) || 1, 1);
    const display = Math.max(Number(query.display) || 10, 1);
    const start = (page - 1) * display;

    return createApiResponse({
      data: {
        page,
        display,
        total: filteredRows.length,
        totalPages: Math.ceil(filteredRows.length / display),
        items: filteredRows.slice(start, start + display),
      },
    });
  }),
];
