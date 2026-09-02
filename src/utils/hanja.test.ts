import { describe, expect, it } from "vitest";
import {
  convertHanjaToHangul,
  extractHanja,
  extractHanjaChunks,
  extractHanjaFromRecord,
  getHanjaWordMapping,
  hasHanja,
  isHanja,
} from "./hanja";


describe("hanja utils", () => {
  it("한자 판별 및 추출", () => {
    expect(isHanja("金")).toBe(true);
    expect(isHanja("김")).toBe(false);
    expect(hasHanja("100 $g 金素月")).toBe(true);
    expect(hasHanja("100 $a 김소월")).toBe(false);

    expect(extractHanja("100 $a 김소월 $g 金素月 1902-1934")).toBe("金素月");
    expect(extractHanjaChunks("100 $a 金素月 $v 詩人")).toEqual(["金素月", "詩人"]);
  });

  it("한자 -> 한글 변환", () => {
    expect(convertHanjaToHangul("尹東柱")).toBe("윤동주");
    expect(convertHanjaToHangul("個人名")).toBe("개인명");
    expect(convertHanjaToHangul("詩人")).toBe("시인");
  });

  it("글자별 한글 매핑 정보 생성", () => {
    const mapping = getHanjaWordMapping("尹東柱");
    expect(mapping.hanja).toBe("尹東柱");
    expect(mapping.hangul).toBe("윤동주");
    expect(mapping.chars).toEqual([
      { char: "尹", hangul: "윤" },
      { char: "東", hangul: "동" },
      { char: "柱", hangul: "주" },
    ]);
  });


  it("전거 레코드에서 한자 행 추출", () => {
    const mockRecord = {
      leader: "00000nz a2200000n 4500",
      controlFields: [
        { tag: "001", value: "KAB000000001" },
        { tag: "008", value: "260831n azaannnnaaan a aaa " },
      ],
      dataFields: [
        {
          tag: "100",
          ind1: "1",
          ind2: " ",
          subfields: [
            { code: "a", value: "윤동주" },
            { code: "g", value: "尹東柱" },
            { code: "d", value: "1917-1945" },
          ],
        },
        {
          tag: "670",
          ind1: " ",
          ind2: " ",
          subfields: [
            { code: "a", value: "한국민족문화대백과사전" },
            { code: "b", value: "詩人" },
          ],
        },
        {
          tag: "370",
          ind1: " ",
          ind2: " ",
          subfields: [{ code: "c", value: "대한민국" }],
        },
      ],
    };

    const result = extractHanjaFromRecord(mockRecord);
    expect(result).toHaveLength(2);

    // 100 필드
    expect(result[0]?.tag).toBe("100");
    expect(result[0]?.hanjaMappings).toHaveLength(1);
    expect(result[0]?.hanjaMappings[0]?.hanja).toBe("尹東柱");
    expect(result[0]?.hanjaMappings[0]?.hangul).toBe("윤동주");
    expect(result[0]?.hanjaMappings[0]?.chars).toEqual([
      { char: "尹", hangul: "윤" },
      { char: "東", hangul: "동" },
      { char: "柱", hangul: "주" },
    ]);

    // 670 필드
    expect(result[1]?.tag).toBe("670");
    expect(result[1]?.hanjaMappings[0]?.hanja).toBe("詩人");
    expect(result[1]?.hanjaMappings[0]?.hangul).toBe("시인");
  });
});


