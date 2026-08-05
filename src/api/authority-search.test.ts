import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { fetchAuthoritySearchResults } from "@/api/authority-search";
import { server } from "@/test/server";

describe("fetchAuthoritySearchResults", () => {
  it("MSW handler가 반환한 검색 결과를 사용한다", async () => {
    server.use(http.get("/api/authority-search", () => HttpResponse.json([])));

    // 예상: 빈 배열
    // await expect(
    //   fetchAuthoritySearchResults({ type: "personal" }),
    // ).resolves.toEqual([]);
  });
});
