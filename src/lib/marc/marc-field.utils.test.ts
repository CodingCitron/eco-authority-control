import { describe, expect, it } from "vitest";

import type { MarcField } from "@/types/marc-editor.types";

import {
  appendMarcDataField,
  createMarcDataField,
  createMarcSubfield,
  isMarcFieldRepeatable,
  isMarcSubfieldRepeatable,
  replaceMarcDataFieldSubfields,
  sortMarcSubfields,
} from "./marc-field.utils";

describe("marc-field.utils", () => {
  it("marc-eco의 필드 반복 규칙을 사용한다", () => {
    expect(isMarcFieldRepeatable("100")).toBe(false);
    expect(isMarcFieldRepeatable("046")).toBe(true);
    expect(isMarcFieldRepeatable("400")).toBe(true);
  });

  it("marc-eco의 서브필드 반복 규칙을 사용한다", () => {
    expect(isMarcSubfieldRepeatable("100", "a")).toBe(false);
    expect(isMarcSubfieldRepeatable("100", "c")).toBe(true);
  });

  it("태그 규칙의 order로 서브필드를 정렬한다", () => {
    expect(
      sortMarcSubfields("100", [
        { code: "g", value: "기타 정보" },
        { code: "d", value: "1902-1934" },
        { code: "a", value: "김소월" },
      ]).map(({ code }) => code),
    ).toEqual(["a", "d", "g"]);
  });

  it("필드를 만들 때 비반복 서브필드는 한 번만 유지한다", () => {
    expect(
      createMarcDataField("100", [
        createMarcSubfield("a", "김소월"),
        createMarcSubfield("a", "김정식"),
        createMarcSubfield("c", "시인"),
        createMarcSubfield("c", "작가"),
      ]),
    ).toMatchObject({
      subfields: [
        { code: "a", value: "김소월" },
        { code: "c", value: "시인" },
        { code: "c", value: "작가" },
      ],
    });
  });

  it("빈값으로 교체하면 서브필드를 지우고 필수 서브필드가 없으면 필드도 지운다", () => {
    const field100 = createMarcDataField("100", [
      createMarcSubfield("a", "김소월"),
      createMarcSubfield("g", "金素月"),
    ], "1");

    expect(
      field100 &&
        replaceMarcDataFieldSubfields(field100, [{ code: "g", value: "" }]),
    ).toMatchObject({
      subfields: [{ code: "a", value: "김소월" }],
    });
    expect(
      field100 &&
        replaceMarcDataFieldSubfields(field100, [{ code: "a", value: "" }]),
    ).toBeUndefined();
  });

  it("비반복 필드는 중복 추가하지 않고 반복 필드는 서로 다른 값을 추가한다", () => {
    const field100 = createMarcDataField("100", [
      createMarcSubfield("a", "김소월"),
    ], "1");
    const anotherField100 = createMarcDataField("100", [
      createMarcSubfield("a", "김정식"),
    ], "1");
    const field400 = createMarcDataField("400", [
      createMarcSubfield("a", "김정식"),
    ], "1");
    const anotherField400 = createMarcDataField("400", [
      createMarcSubfield("a", "KIM, Sowol"),
    ], "1");
    const initialFields = [field100].filter(
      (field): field is NonNullable<typeof field> => Boolean(field),
    );

    const nonRepeatableResult = appendMarcDataField(
      initialFields,
      anotherField100,
    );
    const repeatableResult = appendMarcDataField(
      appendMarcDataField(nonRepeatableResult, field400),
      anotherField400,
    );

    expect(nonRepeatableResult).toBe(initialFields);
    expect(repeatableResult.filter(({ tag }) => tag === "400")).toHaveLength(2);
  });

  it("규칙에 없는 태그는 편집기 데이터 보존을 위해 추가를 허용한다", () => {
    const fields: MarcField[] = [
      {
        type: "data",
        tag: "999",
        indicator1: " ",
        indicator2: " ",
        subfields: [{ code: "a", value: "첫 번째" }],
      },
    ];
    const nextField = createMarcDataField("999", [
      createMarcSubfield("a", "두 번째"),
    ]);

    expect(appendMarcDataField(fields, nextField)).toHaveLength(2);
  });
});
