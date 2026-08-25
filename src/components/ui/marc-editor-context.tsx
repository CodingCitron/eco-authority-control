import { createContext, useContextSelector } from "use-context-selector";
import {
  getFieldRule,
  type ControlFieldRule,
  type PositionRule,
} from "marc-eco";

export interface LeaderData {
  status: string; // 05
  type: string; //06
  encodingLevel: string; //17
  raw?: string;
}

/** 24자리 Leader 문자열을 고정길이 모달에서 사용하는 형태로 변환한다. */
export function parseLeaderData(raw: string): LeaderData {
  return {
    status: raw[5] ?? "",
    type: raw[6] ?? "",
    encodingLevel: raw[17] ?? "",
    raw,
  };
}

export interface ControlField008 {
  entryDate: string; // 00-05: 입력날짜 (YYMMDD)
  geoSubdivision?: string; // 06: 지리구분
  romanization?: string; // 07: 로마자변좌
  recordKind?: string; // 09: 레코드 종류
  catalogingForm?: string; // 10: 목록기술형식
  subjectHeading?: string; // 11: 주제명목표표
  seriesType?: string; // 12: 총서유형
  seriesNumFlag?: string; // 13: 총서번호유무
  mainHeadingUse?: string; // 14: 표목사용(주목목)
  subjAddedEntry?: string; // 15: 주제부출표목
  seriesAddedEntry?: string; // 16: 총서부출표목
  subjectSubtype?: string; // 17: 주제세목유형
  referenceEvaluation?: string; // 29: 참조평가
  recordUpdate?: string; // 31: 레코드갱신
  nameType?: string; // 32: 동명이인
  headingLevel?: string; // 33: 채택표목수준
  modifiedRecord?: string; // 38: 수정레코드
  catalogingAgency?: string; // 39: 목록작성기관
  /** 모달에서 편집하지 않는 위치의 값을 보존하기 위한 원본 40자리 값 */
  sourceValue?: string;
}

export const EMPTY_CONTROL_FIELD_008: ControlField008 = {
  entryDate: "",
};

type EditableControlField008Name = Exclude<
  keyof ControlField008,
  "sourceValue"
>;

const CONTROL_FIELD_008_NAME_BY_CODE_SET: Readonly<
  Record<string, EditableControlField008Name>
> = {
  FIX_008_06: "geoSubdivision",
  FIX_008_07: "romanization",
  FIX_008_09: "recordKind",
  FIX_008_10: "catalogingForm",
  FIX_008_11: "subjectHeading",
  FIX_008_12: "seriesType",
  FIX_008_13: "seriesNumFlag",
  FIX_008_14: "mainHeadingUse",
  FIX_008_15: "subjAddedEntry",
  FIX_008_16: "seriesAddedEntry",
  FIX_008_17: "subjectSubtype",
  FIX_008_29: "referenceEvaluation",
  FIX_008_31: "recordUpdate",
  FIX_008_32: "nameType",
  FIX_008_33: "headingLevel",
  FIX_008_38: "modifiedRecord",
  FIX_008_39: "catalogingAgency",
};

function getControlField008Rule(): ControlFieldRule & {
  length: number;
  positions: readonly PositionRule[];
} {
  const fieldRule = getFieldRule("008");

  if (
    !fieldRule ||
    !("positions" in fieldRule) ||
    fieldRule.length === undefined ||
    fieldRule.positions === undefined
  ) {
    throw new Error("marc-eco에 008 제어필드 위치 규칙이 없습니다.");
  }

  return fieldRule as ControlFieldRule & {
    length: number;
    positions: readonly PositionRule[];
  };
}

function getControlField008Name(
  position: PositionRule,
  positionIndex: number,
): EditableControlField008Name | undefined {
  // 규칙의 첫 구간은 코드셋이 없는 입력일자(00-05)이다.
  if (positionIndex === 0) {
    return "entryDate";
  }

  return position.codeset
    ? CONTROL_FIELD_008_NAME_BY_CODE_SET[position.codeset]
    : undefined;
}

function readPosition(value: string, start: number, length = 1) {
  return value.slice(start, start + length);
}

/** 40자리 008 문자열을 편집 모달에서 사용하는 구조로 변환한다. */
export function parseControlField008(value: string): ControlField008 {
  const fieldRule = getControlField008Rule();
  const sourceValue = value
    .padEnd(fieldRule.length, " ")
    .slice(0, fieldRule.length);
  const result: ControlField008 = { entryDate: "", sourceValue };

  fieldRule.positions.forEach((position, positionIndex) => {
    const name = getControlField008Name(position, positionIndex);
    if (!name) {
      return;
    }

    const positionValue = readPosition(
      sourceValue,
      position.start,
      position.length,
    );
    result[name] = name === "entryDate" ? positionValue.trimEnd() : positionValue;
  });

  return result;
}

function writePosition(
  characters: string[],
  start: number,
  length: number,
  value: string | undefined,
) {
  if (value === undefined) {
    return;
  }

  const normalizedValue = value.padEnd(length, " ").slice(0, length);
  characters.splice(start, length, ...normalizedValue);
}

/** 편집된 값을 40자리 008 문자열로 변환하며 편집하지 않은 위치는 보존한다. */
export function formatControlField008(data: ControlField008) {
  const fieldRule = getControlField008Rule();
  const characters = (data.sourceValue ?? "")
    .padEnd(fieldRule.length, " ")
    .slice(0, fieldRule.length)
    .split("");

  fieldRule.positions.forEach((position, positionIndex) => {
    const name = getControlField008Name(position, positionIndex);
    if (!name) {
      return;
    }

    writePosition(
      characters,
      position.start,
      position.length,
      data[name],
    );
  });

  return characters.join("");
}

export interface SubField {
  code: string; // 서브필드 코드 (예: "a", "b", "c")
  value: string; // 서브필드 값
}

export interface MarcDataField {
  type: "data";
  tag: string; // 태그 번호 (예: "100", "400")
  indicator1: string; // 제1지시기
  indicator2: string; // 제2지시기
  subfields: SubField[];
}

export interface MarcData {
  leaderData?: LeaderData;
  variableFields?: MarcField[];
  setLeaderData: (leaderData: LeaderData) => void;
  setVariableFields: (variableFields: MarcField[]) => void;
}

export interface MarcControlField {
  type: "control";
  tag: string;
  value: string;
}

export type MarcField = MarcControlField | MarcDataField;

export const MarcEditorContext = createContext<MarcData | null>(null);

export function useMarcEditor() {
  const leaderData = useContextSelector(
    MarcEditorContext,
    (context) => context?.leaderData,
  );
  const variableFields = useContextSelector(
    MarcEditorContext,
    (context) => context?.variableFields,
  );
  const setLeaderData = useContextSelector(
    MarcEditorContext,
    (context) => context?.setLeaderData,
  );
  const setVariableFields = useContextSelector(
    MarcEditorContext,
    (context) => context?.setVariableFields,
  );

  if (
    !leaderData ||
    !variableFields ||
    !setLeaderData ||
    !setVariableFields
  ) {
    throw new Error(
      "useMarcEditor는 MarcEditorProvider 내부에서 사용해야 합니다.",
    );
  }

  return {
    leaderData,
    variableFields,
    setLeaderData,
    setVariableFields,
  };
}
