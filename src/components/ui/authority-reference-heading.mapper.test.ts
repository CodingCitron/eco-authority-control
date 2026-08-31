import { describe, expect, it } from "vitest";

import type { AuthorityDetailData } from "@/types/authority-detail.types";
import type { AuthoritySearchType } from "@/types/authority.types";

import { create5XXReferenceFields } from "./authority-reference-heading.mapper";

function createRecord(
  headingTag: string,
  indicator1 = " ",
): AuthorityDetailData["record"] {
  return {
    leader: "",
    controlFields: [{ tag: "001", value: "KAC000000001" }],
    dataFields: [
      {
        tag: headingTag,
        ind1: indicator1,
        ind2: " ",
        subfields: [
          { code: "a", value: "채택표목" },
          { code: "0", value: "교체할 제어번호" },
        ],
      },
    ],
  };
}

describe("create5XXReferenceFields", () => {
  it.each([
    ["0", "100"],
    ["1", "110"],
    ["5", "151"],
    ["4", "150"],
  ] satisfies Array<[AuthoritySearchType, string]>) (
    "%s 검색 전거에서는 %s 채택표목을 읽어 현재 단체명의 510으로 만든다",
    (acType, headingTag) => {
      const [field] = create5XXReferenceFields(
        acType,
        createRecord(headingTag, "1"),
        "b",
        "510",
      );

      expect(field).toMatchObject({
        type: "data",
        tag: "510",
        indicator1: " ",
        indicator2: " ",
        subfields: [
          { code: "w", value: "b" },
          { code: "a", value: "채택표목" },
          { code: "0", value: "KAC000000001" },
        ],
      });
    },
  );

  it("적용안함이면 $w를 만들지 않는다", () => {
    const [field] = create5XXReferenceFields(
      "1",
      createRecord("110"),
      "",
      "510",
    );

    expect(field.subfields).not.toContainEqual(
      expect.objectContaining({ code: "w" }),
    );
  });

  it("해당 전거유형의 채택표목이 없으면 빈 목록을 반환한다", () => {
    expect(
      create5XXReferenceFields("1", createRecord("100"), "a", "510"),
    ).toEqual([]);
    expect(create5XXReferenceFields("1", undefined, "a", "510")).toEqual([]);
  });
});
