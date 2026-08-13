import { http } from "msw";

import {
  type AuthoritySearchType,
  isAuthoritySearchType,
  type AuthorityRecord,
} from "@/types/authority-search.types";

import type {
  AuthoritySearchQueryParams,
  AuthoritySearchResponse,
} from "@/api/authority-search";
import { createApiResponse } from "@/mocks/utils";

// ==========================================
// 1. Mock 데이터 정의 (개인명 / 단체명 / 지리명 / 주제명)
// ==========================================

const personalRows: AuthoritySearchResponse = {
  data: {
    page: 1,
    display: 10,
    total: 1,
    totalPages: 1,
    items: [
      {
        recKey: 9276158304927164,
        acType: 0,
        acRegionDesc: "국내",
        headingName: "김소월",
        hanjaName: "金素月",
        birthDeathDate: "1902-09-07~1934-12-24",
        activityField: "문학",
        sourceDataFound: "한국민족문화대백과사전",
        acControlNo: "KAC199900000001",
        firstWorker: "admin",
        inputDate: "2026-08-12T08:40:09.517Z",
        lastWorker: "librarian01",
      },
    ],
  },
};

const corporationRows: AuthoritySearchResponse = {
  data: {
    page: 1,
    display: 10,
    total: 1,
    totalPages: 1,
    items: [
      {
        recKey: 927615830492716,
        acType: 1,
        acRegionDesc: "국내",
        headingName: "국립중앙도서관",
        organizationType: "정부기관",
        establishmentDate: "1945-10-15",
        terminationDate: null,
        activityField: "도서관",
        sourceDataFound: "국립중앙도서관 홈페이지",
        acControlNo: "KAC199900000002",
        firstWorker: "admin",
        inputDate: "2026-08-12T08:44:08.573Z",
        lastWorker: "librarian02",
      },
    ],
  },
};

const geographyRows: AuthoritySearchResponse = {
  data: {
    page: 1,
    display: 10,
    total: 1,
    totalPages: 1,
    items: [
      {
        recKey: 9276158304927162,
        acType: 5,
        acRegionDesc: "국내",
        headingName: "서울특별시",
        sourceDataFound: "대한민국 행정구역",
        acControlNo: "KAC200000000002",
        firstWorker: "admin",
        inputDate: "2026-08-12T08:45:33.295Z",
        lastWorker: "librarian04",
      },
    ],
  },
};

const subjectRows: AuthoritySearchResponse = {
  data: {
    page: 1,
    display: 10,
    total: 1,
    totalPages: 1,
    items: [
      {
        recKey: 9276158304927166,
        acType: 4,
        acRegionDesc: "국내",
        headingName: "인공지능",
        sourceDataFound: "국립중앙도서관 주제명표목표",
        acControlNo: "KAC200000000001",
        firstWorker: "admin",
        inputDate: "2026-08-12T08:45:57.440Z",
        lastWorker: "librarian03",
      },
    ],
  },
};

/** 전체 전거 레코드 Mock 데이터 */
export const authoritySearchMockData: AuthorityRecord[] = [
  ...personalRows.data.items,
  ...corporationRows.data.items,
  ...geographyRows.data.items,
  ...subjectRows.data.items,
];

// ==========================================
// 2. 쿼리 파라미터 타입 및 파싱 함수
// ==========================================

/**
 * Request 객체에서 쿼리 파라미터를 읽어 명확한 타입 객체로 변환합니다.
 */
function parseQueryParams(request: Request): AuthoritySearchQueryParams {
  const url = new URL(request.url);
  const params = url.searchParams;

  return {
    searchKeyword: params.get("searchKeyword"),
    searchType: params.get("searchType"),
    acRegionCode: params.get("acRegionCode"),
    acType: params.get("acType") as AuthoritySearchType | null,
    acControlNo: params.get("acControlNo"),
    page: params.get("page") || "1",
    display: params.get("display") || params.get("pageSize") || "10",
  };
}

// ==========================================
// 3. MSW Mock API 핸들러
// ==========================================

/**
 * [GET] /api/ac/search
 * 전거 레코드(개인명, 단체명, 지리명, 주제명) 통합 검색 Mock API
 */
export const authoritySearchHandlers = [
  http.get("/api/ac/search", ({ request }) => {
    // 1) 쿼리 파라미터 파싱
    const query = parseQueryParams(request);

    // 2) 검색 조건에 따른 데이터 필터링 (Early Return)
    const results = authoritySearchMockData.filter((row) => {
      // ① 전거 구분(타입) 필터링
      if (
        query.acType &&
        isAuthoritySearchType(query.acType) &&
        row.acType !== Number(query.acType)
      ) {
        return false;
      }

      // 제어번호 포함 여부 검색
      if (query.acControlNo && !row.acControlNo.includes(query.acControlNo)) {
        return false;
      }

      // 표목명 포함 여부 검색
      if (
        query.searchKeyword &&
        !row.headingName.includes(query.searchKeyword)
      ) {
        return false;
      }

      return true;
    });

    // 3) 공통 API 응답 구조 ({ result: { code: 'Y', ... }, contents: [...] })로 반환
    const page = Math.max(Number(query.page) || 1, 1);
    const pageSize = Math.max(Number(query.display) || 10, 1);
    const start = (page - 1) * pageSize;

    return createApiResponse({
      data: {
        page,
        display: pageSize,
        total: results.length,
        totalPages: Math.ceil(results.length / pageSize),
        items: results,
      },
    });
  }),
];
