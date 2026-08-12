import { http } from "msw";

import {
  type PersonalRow,
  type AuthoritySearchType,
  authorityTypeLabels,
} from "@/types/authority.types";
import type {
  AuthorityRecord,
  AuthoritySearchResponse,
} from "@/api/authority-search";
import { createApiResponse } from "@/mocks/utils";

// ==========================================
// 1. Mock 데이터 정의 (개인명 / 단체명 / 지리명 / 주제명)
// ==========================================

const personalRows: {
  totalCount: number;
  data: PersonalRow[];
} = {
  totalCount: 2,
  data: [
    {
      id: "1",
      type: "개인명",
      nationality: "한국",
      heading: "김소월",
      hanjaName: "金素月",
      years: "1902-1934",
      field: "한국 시;문학(372$a)1",
      source: "김소월 시집(670$a)",
      controlNumber: "KAC202600001",
      creator: "홍길동",
      modifiedBy: "김영희",
    },
    {
      id: "2",
      type: "개인명",
      nationality: "한국",
      heading: "김소월",
      hanjaName: "金素月",
      years: "1902-1934",
      field: "한국 시;문학(372$a)2",
      source: "김소월 전집(670$a)",
      controlNumber: "KAC202600002",
      creator: "이몽룡",
      modifiedBy: "김영희",
    },
  ],
};

const corporationRows: AuthoritySearchResponse = {
  totalCount: 1,
  data: [
    {
      id: "1",
      type: "단체명",
      nationality: "한국",
      heading: "헌법재판소.헌법재판연구원",
      organizationType: "학술단체(연구소.연구단체)",
      established: "20110101-",
      field: "법학(法學)(372 $a)",
      source: "헌법 연구 자료(670 $a)",
      controlNumber: "KAB201206266",
      creator: "홍길동",
      modifiedBy: "김영희",
    },
  ],
};

const geographyRows: AuthoritySearchResponse = {
  totalCount: 1,
  data: [
    {
      id: "1",
      type: "지리명",
      nationality: "한국",
      heading: "울릉도[鬱陵島]",
      source: "서울특별시 자료(670 $a)",
      controlNumber: "KAG201206266",
      creator: "홍길동",
      modifiedBy: "김영희",
    },
  ],
};

const subjectRows: AuthoritySearchResponse = {
  totalCount: 2,
  data: [
    {
      id: "1",
      type: "주제명",
      nationality: "한국",
      heading: "부작위(不作爲)",
      source: "법률용어사전(670 $a)",
      note: "이 표목은 법률상 의무가 있는 자가 ...",
      controlNumber: "KSH201400013",
      creator: "홍길동",
      modifiedBy: "김영희",
    },
    {
      id: "2",
      type: "주제명",
      nationality: "한국",
      heading: "부작위",
      source: "",
      note: "",
      controlNumber: "KSH201300011",
      creator: "관리자",
      modifiedBy: "김영신",
    },
  ],
};

/** 전체 전거 레코드 Mock 데이터 */
export const authoritySearchMockData: AuthorityRecord[] = [
  ...personalRows.data,
  ...corporationRows.data,
  ...geographyRows.data,
  ...subjectRows.data,
];

// ==========================================
// 2. 쿼리 파라미터 타입 및 파싱 함수
// ==========================================

/**
 * GET /api/authority-search 쿼리 파라미터 규격
 */
export interface AuthoritySearchQueryParams {
  /** 전거 구분 타입 (personal | corporation | geography | subject) */
  type?: AuthoritySearchType | null;
  /** 국적 */
  nationality?: string | null;
  /** 제어번호 단일 검색어 */
  controlNumber?: string | null;
  /** 표목명 */
  heading?: string | null;
  page?: number | null;
  pageSize?: number | null;
}

/**
 * Request 객체에서 쿼리 파라미터를 읽어 명확한 타입 객체로 변환합니다.
 */
function parseQueryParams(request: Request): AuthoritySearchQueryParams {
  const url = new URL(request.url);
  const params = url.searchParams;

  return {
    type: params.get("type") as AuthoritySearchType | null,
    nationality: params.get("nationality"),
    controlNumber: params.get("controlNumber"),
    heading: params.get("heading"),
    page: Number(params.get("page") || 1),
    pageSize: Number(params.get("pageSize") || 10),
  };
}

// ==========================================
// 3. MSW Mock API 핸들러
// ==========================================

/**
 * [GET] /api/authority-search
 * 전거 레코드(개인명, 단체명, 지리명, 주제명) 통합 검색 Mock API
 */
export const authoritySearchHandlers = [
  http.get("/api/ac/search", ({ request }) => {
    // 1) 쿼리 파라미터 파싱
    const query = parseQueryParams(request);

    // 2) 검색 조건에 따른 데이터 필터링 (Early Return)
    const results = authoritySearchMockData.filter((row) => {
      // ① 전거 구분(타입) 필터링 ("all"이거나 없을 경우 전체 검색)
      if (
        query.type &&
        query.type !== "0" &&
        row.type !== authorityTypeLabels[query.type]
      ) {
        return false;
      }
      // 국적 필터링
      if (
        query.nationality &&
        query.nationality !== "all" &&
        row.nationality !== query.nationality
      ) {
        return false;
      }
      // 제어번호 포함 여부 검색
      if (
        query.controlNumber &&
        !row.controlNumber.includes(query.controlNumber)
      ) {
        return false;
      }

      // 표목명 포함 여부 검색
      if (query.heading && !row.heading.includes(query.heading)) {
        return false;
      }

      return true;
    });

    // 3) 공통 API 응답 구조 ({ result: { code: 'Y', ... }, contents: [...] })로 반환
    const page = Math.max(query.page || 1, 1);
    const pageSize = Math.max(query.pageSize || 10, 1);
    const start = (page - 1) * pageSize;

    return createApiResponse({
      totalCount: results.length,
      data: results.slice(start, start + pageSize),
    });
  }),
];
