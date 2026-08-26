import { describe, expect, it } from "vitest";

import { getAuthoritySearchState } from "./use-authority-search";
import { getAuthorityStatisticsSearchState } from "./use-authority-statistics";

describe("URL 기반 조회 상태", () => {
  it("전거 검색조건이 있을 때만 검색을 실행 대상으로 본다", () => {
    expect(
      getAuthoritySearchState(new URLSearchParams()).isSearched,
    ).toBe(false);
    expect(
      getAuthoritySearchState(new URLSearchParams("isSearched=true"))
        .isSearched,
    ).toBe(false);
    expect(
      getAuthoritySearchState(new URLSearchParams("acType=0")).isSearched,
    ).toBe(true);
  });

  it("구축현황의 등록일자 조건과 조회 여부를 URL에서 변환한다", () => {
    expect(
      getAuthorityStatisticsSearchState(
        new URLSearchParams(
          "regDateFrom=2026-08-01&regDateTo=2026-08-26",
        ),
      ),
    ).toEqual({
      params: {
        from: "2026-08-01",
        to: "2026-08-26",
      },
      isSearched: true,
    });
  });

  it("조회 표시가 없는 구축현황 URL은 자동으로 조회하지 않는다", () => {
    expect(
      getAuthorityStatisticsSearchState(
        new URLSearchParams("isSearched=true"),
      ).isSearched,
    ).toBe(false);
  });

  it("구축현황 전체 조회는 acType=all로 구분한다", () => {
    expect(
      getAuthorityStatisticsSearchState(new URLSearchParams("acType=all"))
        .isSearched,
    ).toBe(true);
  });
});
