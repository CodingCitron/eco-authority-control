import { describe, expect, it } from "vitest";

import type { MarcField } from "@/components/ui/marc-editor-context";
import type { AuthorityDetailData } from "@/types/authority-detail.types";

import {
  addPersonalFormValuesToMarcFields,
  createEmptyPersonalAuthorityFormValues,
  mapAuthorityDetailToPersonalFormValues,
  mapPersonalFormValuesToAuthorityCreateMetadata,
  type PersonalMarcAddTarget,
} from "./personal-form.mapper";

describe("mapAuthorityDetailToPersonalFormValues", () => {
  it("수정 화면은 비반복 값을 채우고 반복 필드 입력은 비워 둔다", () => {
    const detail: AuthorityDetailData = {
      recKey: "1",
      acType: "0",
      acControlNo: "AUTH0001",
      acRegionCode: "1",
      activityField: "문학",
      hanjaName: "金素月",
      headingName: "김소월",
      birthDeathDate: null,
      firstInputDate: "2026-08-25",
      firstWorker: "tester",
      lastUpdateDate: "2026-08-26",
      lastWorker: "editor",
      sourceControlNo: "",
      sourceDataFound: "진달래꽃, 2011",
      record: {
        leader: "",
        control_fields: [],
        data_fields: [
          {
            tag: "100",
            ind1: "1",
            ind2: " ",
            subfields: [
              { code: "a", value: "김소월" },
              { code: "g", value: "金素月" },
            ],
          },
          {
            tag: "046",
            ind1: " ",
            ind2: " ",
            subfields: [
              { code: "f", value: "1902" },
            ],
          },
          {
            tag: "046",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "g", value: "1934" }],
          },
          {
            tag: "400",
            ind1: "1",
            ind2: " ",
            subfields: [{ code: "a", value: "김정식" }],
          },
          {
            tag: "370",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "a", value: "평안북도 구성" }],
          },
          {
            tag: "667",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "a", value: "배재고등보통학교" }],
          },
          {
            tag: "670",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "a", value: "진달래꽃, 2011" }],
          },
        ],
      },
    };

    const values = mapAuthorityDetailToPersonalFormValues(detail);

    expect(values).toMatchObject({
      authorityType: "100",
      region: "1",
      heading: "김소월",
      hanjaName: "金素月",
      birthDate: "1902",
      deathDate: "1934",
      referenceHeading: "",
      place: "",
      activityField: "",
      education: "",
      source: "",
      createdBy: "tester",
      updatedBy: "editor",
    });
  });
});

describe("mapPersonalFormValuesToAuthorityCreateMetadata", () => {
  it("신규 개인명 입력 폼은 개인명 전거를 기본 선택한다", () => {
    expect(createEmptyPersonalAuthorityFormValues().authorityType).toBe("100");
  });

  it("입력된 공통 항목만 전거 생성 메타데이터로 변환한다", () => {
    expect(
      mapPersonalFormValuesToAuthorityCreateMetadata({
        authorityType: "100",
        region: " 1 ",
        createdAt: "2026-08-25T10:00:00",
        createdBy: "tester",
      }),
    ).toEqual({
      acType: "0",
      acRegionCode: "1",
      firstInputDate: "2026-08-25T10:00:00",
      firstWorker: "tester",
    });
  });

  it("입력되지 않은 항목은 생성 메타데이터에서 제외한다", () => {
    expect(
      mapPersonalFormValuesToAuthorityCreateMetadata({
        authorityType: "",
        region: "",
        createdAt: "",
        createdBy: "",
      }),
    ).toEqual({});
  });
});

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
      education: "배재고등보통학교",
      biography: "시인; 1920년 등단",
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
      "education",
      "biography",
    ];

    const fields = targets.reduce<MarcField[]>(
      (currentFields, target) =>
        addPersonalFormValuesToMarcFields(currentFields, target, values),
      [],
    );

    expect(fields.map(({ tag }) => tag)).toEqual([
      "046",
      "046",
      "100",
      "370",
      "371",
      "372",
      "373",
      "374",
      "377",
      "400",
      "400",
      "667",
      "670",
      "678",
    ]);
    expect(fields[0]).toMatchObject({
      tag: "046",
      subfields: [{ code: "f", value: "1902" }],
    });
    expect(fields[1]).toMatchObject({
      tag: "046",
      subfields: [{ code: "g", value: "1934" }],
    });
    expect(fields[2]).toMatchObject({
      tag: "100",
      subfields: [
        { code: "a", value: "김소월" },
        { code: "g", value: "金素月" },
      ],
    });
    expect(fields[3]).toMatchObject({
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
    expect(fields.find(({ tag }) => tag === "667")).toMatchObject({
      subfields: [{ code: "a", value: "배재고등보통학교" }],
    });
    expect(fields.find(({ tag }) => tag === "678")).toMatchObject({
      subfields: [{ code: "a", value: "시인; 1920년 등단" }],
    });
  });

  it("분리된 046 구조를 유지하고 없던 100 $d는 추가하지 않는다", () => {
    const fields: MarcField[] = [
      {
        type: "data",
        tag: "046",
        indicator1: " ",
        indicator2: " ",
        subfields: [{ code: "f", value: "1898" }],
      },
      {
        type: "data",
        tag: "046",
        indicator1: " ",
        indicator2: " ",
        subfields: [{ code: "g", value: "1976" }],
      },
      {
        type: "data",
        tag: "100",
        indicator1: "1",
        indicator2: " ",
        subfields: [{ code: "a", value: "Aalto, Alvar" }],
      },
    ];
    const values = {
      ...createEmptyPersonalAuthorityFormValues(),
      birthDate: "1899",
      deathDate: "1977",
    };

    const result = addPersonalFormValuesToMarcFields(
      fields,
      "birthDeathDate",
      values,
    );

    expect(result.filter(({ tag }) => tag === "046")).toMatchObject([
      { subfields: [{ code: "f", value: "1899" }] },
      { subfields: [{ code: "g", value: "1977" }] },
    ]);
    expect(result.find(({ tag }) => tag === "100")).toMatchObject({
      subfields: [{ code: "a", value: "Aalto, Alvar" }],
    });
  });

  it("기존 046의 생몰일을 갱신하면서 다른 서브필드는 보존한다", () => {
    const fields: MarcField[] = [
      {
        type: "data",
        tag: "046",
        indicator1: " ",
        indicator2: " ",
        subfields: [
          { code: "f", value: "1900" },
          { code: "g", value: "1980" },
          { code: "2", value: "edtf" },
        ],
      },
      {
        type: "data",
        tag: "100",
        indicator1: "1",
        indicator2: " ",
        subfields: [
          { code: "a", value: "김소월" },
          { code: "d", value: "1900-1980" },
        ],
      },
    ];
    const values = {
      ...createEmptyPersonalAuthorityFormValues(),
      birthDate: "1902",
      deathDate: "1934",
    };

    const result = addPersonalFormValuesToMarcFields(
      fields,
      "birthDeathDate",
      values,
    );

    expect(result.find(({ tag }) => tag === "046")).toMatchObject({
      subfields: [
        { code: "f", value: "1902" },
        { code: "g", value: "1934" },
        { code: "2", value: "edtf" },
      ],
    });
    expect(result.find(({ tag }) => tag === "100")).toMatchObject({
      subfields: [
        { code: "a", value: "김소월" },
        { code: "d", value: "1902-1934" },
      ],
    });
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
