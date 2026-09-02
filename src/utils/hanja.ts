import type { AuthorityDetailData } from "@/types/authority-detail.types";
import hanjaModule from "hanja";

// CommonJS 번들에서는 default가 한 번 더 감싸져 들어오므로 두 형태를 모두 지원한다.
const hanja = (
  "default" in hanjaModule ? hanjaModule.default : hanjaModule
) as typeof hanjaModule;

/** 문자가 한자인지 확인 */
export function isHanja(char: string) {
  return /\p{Script=Han}/u.test(char);
}

/** 문자열에 한자가 있는지 확인 */
export function hasHanja(text: string) {
  return /\p{Script=Han}/u.test(text);
}

/** 문자열에서 한자만 뽑아내기 */
export function extractHanja(text: string) {
  return text.replace(/[^\p{Script=Han}]/gu, "");
}

/** 배열에서 한자만 뽑아내기 */
export function extractHanjaFromArray(arr: string[]) {
  return arr.filter((text) => isHanja(text));
}

/** 연속된 한자 단어(청크) 추출 */
export function extractHanjaChunks(text: string): string[] {
  const matches = text.match(/\p{Script=Han}+/gu);
  return matches ?? [];
}

/** 한자를 한글로 치환 변환 */
export function convertHanjaToHangul(text: string): string {
  if (!text) return "";
  try {
    return hanja.translate(text, "SUBSTITUTION");
  } catch {
    return text;
  }
}

export interface HanjaCharMapping {
  char: string;
  hangul: string;
}

export interface HanjaWordMapping {
  hanja: string;
  hangul: string;
  chars: HanjaCharMapping[];
}

/** 한자 단어 및 개별 한자 글자별 매핑 정보 반환 */
export function getHanjaWordMapping(hanjaWord: string): HanjaWordMapping {
  const hangul = convertHanjaToHangul(hanjaWord);
  const chars: HanjaCharMapping[] = [];

  for (let i = 0; i < hanjaWord.length; i++) {
    const char = hanjaWord[i]!;
    const charHangul = convertHanjaToHangul(char);
    chars.push({
      char,
      hangul: charHangul,
    });
  }

  return {
    hanja: hanjaWord,
    hangul,
    chars,
  };
}

export interface HanjaRecordRow {
  key: string;
  tag: string;
  ind1?: string;
  ind2?: string;
  fullFieldText: string;
  hanjaMappings: HanjaWordMapping[];
}

/** 전거 레코드에서 한자가 포함된 행들과 한자-한글 매핑 정보 추출 */
export function extractHanjaFromRecord(
  record?: AuthorityDetailData["record"],
): HanjaRecordRow[] {
  if (!record) return [];

  const rows: HanjaRecordRow[] = [];

  // 1. controlFields 검사
  if (Array.isArray(record.controlFields)) {
    record.controlFields.forEach((cf, idx) => {
      if (hasHanja(cf.value)) {
        const chunks = extractHanjaChunks(cf.value);

        rows.push({
          key: `control-${cf.tag}-${idx}`,
          tag: cf.tag,
          fullFieldText: `${cf.tag} ${cf.value}`,
          hanjaMappings: chunks.map(getHanjaWordMapping),
        });
      }
    });
  }

  // 2. dataFields 검사
  if (Array.isArray(record.dataFields)) {
    record.dataFields.forEach((df, idx) => {
      const subfieldsText = (df.subfields ?? [])
        .map((s) => `$${s.code} ${s.value}`)
        .join(" ");
      const fullText = `${df.tag} ${df.ind1 ?? " "}${df.ind2 ?? " "} ${subfieldsText}`;

      if (hasHanja(fullText)) {
        const chunks = extractHanjaChunks(fullText);
        rows.push({
          key: `data-${df.tag}-${idx}`,
          tag: df.tag,
          ind1: df.ind1,
          ind2: df.ind2,
          fullFieldText: fullText,
          hanjaMappings: chunks.map(getHanjaWordMapping),
        });
      }
    });
  }

  return rows;
}
