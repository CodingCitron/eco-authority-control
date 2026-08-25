import { describe, expect, it } from "vitest";

import type { MarcField } from "@/components/ui/marc-editor-context";

import {
  addPersonalFormValuesToMarcFields,
  createEmptyPersonalAuthorityFormValues,
  type PersonalMarcAddTarget,
} from "./personal-form.mapper";

describe("addPersonalFormValuesToMarcFields", () => {
  it("개인명 폼 값을 태그 순서의 MARC 필드로 추가한다", () => {
    const values = {
      ...createEmptyPersonalAuthorityFormValues(),
      heading: "김소월",
      hanjaName: "金素月",
      birthDate: "1902",
      deathDate: "1934",
      referenceHeading: "김정식",
      referenceHanja: "金廷湜",
      referenceOriginalName: "KIM, Sowol",
      placeType: "birth",
      place: "평안북도 구성",
      placeDateFrom: "1902",
      addressType: "m",
      address: "example@example.com",
      activityField: "한국 시",
      organization: "동아일보 정주지국",
      occupation: "작가",
      language: "한국어",
      source: "진달래꽃, 2011",
    };
    const targets: PersonalMarcAddTarget[] = [
      "source",
      "referenceHeading",
      "referenceHanja",
      "heading",
      "birthDeathDate",
      "referenceOriginalName",
      "place",
      "address",
      "activityField",
      "organization",
      "occupation",
      "language",
    ];

    const fields = targets.reduce<MarcField[]>(
      (currentFields, target) =>
        addPersonalFormValuesToMarcFields(currentFields, target, values),
      [],
    );

    expect(fields.map(({ tag }) => tag)).toEqual([
      "100",
      "370",
      "371",
      "372",
      "373",
      "374",
      "377",
      "400",
      "400",
      "670",
    ]);
    expect(fields[0]).toMatchObject({
      tag: "100",
      subfields: [
        { code: "a", value: "김소월" },
        { code: "g", value: "金素月" },
        { code: "d", value: "1902-1934" },
      ],
    });
    expect(fields[1]).toMatchObject({
      tag: "370",
      subfields: [
        { code: "a", value: "평안북도 구성" },
        { code: "s", value: "1902" },
      ],
    });
    expect(fields.filter(({ tag }) => tag === "400")).toMatchObject([
      {
        subfields: [
          { code: "a", value: "김정식" },
          { code: "g", value: "金廷湜" },
        ],
      },
      { subfields: [{ code: "a", value: "KIM, Sowol" }] },
    ]);
  });

  it("동일한 반복 필드는 중복으로 추가하지 않는다", () => {
    const values = {
      ...createEmptyPersonalAuthorityFormValues(),
      source: "진달래꽃, 2011",
    };
    const firstFields = addPersonalFormValuesToMarcFields(
      [],
      "source",
      values,
    );

    expect(
      addPersonalFormValuesToMarcFields(firstFields, "source", values),
    ).toBe(firstFields);
  });
});
