import { describe, expect, it } from "vitest";

import { authoritySettingsResponseSchema } from "./authority-settings";

const validResponse = {
  data: {
    TRUNCATION_TYPE: {
      EXACT: "완전일치",
      PREFIX: "우절단",
      SUFFIX: "좌절단",
      CONTAINS: "양단절단",
    },
    REGION_CODE: {
      "1": "한국",
      "2": "중국",
    },
  },
};

describe("authoritySettingsResponseSchema", () => {
  it("절단 방식과 동적인 지역 코드 맵을 검증한다", () => {
    expect(authoritySettingsResponseSchema.parse(validResponse)).toEqual(
      validResponse,
    );
  });

  it("필수 절단 방식이 누락되면 검증에 실패한다", () => {
    const invalidResponse = structuredClone(validResponse);
    Reflect.deleteProperty(invalidResponse.data.TRUNCATION_TYPE, "CONTAINS");

    expect(() => authoritySettingsResponseSchema.parse(invalidResponse)).toThrow();
  });
});
