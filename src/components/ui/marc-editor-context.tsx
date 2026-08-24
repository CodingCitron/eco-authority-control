import { createContext } from "react";
import { useContextSelector } from "use-context-selector";

export interface LeaderData {
  status: string; // 05
  type: string; //06
  encodingLevel: string; //17
  raw?: string;
}

export interface ControlField008 {
  entryDate: string; // 00-05: 입력날짜 (YYMMDD)
  geoSubdivision?: string; // 06: 지리구분
  romanization?: string; // 07: 로마자변좌
  recordKind?: string; // 08: 레코드 종류
  catalogingForm?: string; // 10: 목록기술형식
  subjectHeading?: string; // 11: 주제명목표표
  seriesType?: string; // 12: 총서유형
  seriesNumFlag?: string; // 13: 총서번호유무
  mainHeadingUse?: string; // 14: 표목사용(주목목)
  subjAddedEntry?: string; // 15: 주제부출표목
  seriesAddedEntry?: string; // 16: 총서부출표목
  subjectSubtype?: string; // 17: 주제세목유형
  referenceEvaluation?: string; // 29: 참조평가
  recordUpdate?: string; // 30: 레코드갱신
  nameType?: string; // 33: 동명이인
  headingLevel?: string; // 39: 채택표목수준
  modifiedRecord?: string; // 38: 수정레코드
  catalogingAgency?: string; // 35-37: 목록작성기관
}

export interface SubField {
  code: string; // 서브필드 코드 (예: "a", "b", "c")
  value: string; // 서브필드 값
}

export interface MarcField {
  tag: string; // 태그 번호 (예: "100", "400")
  indicator1: string; // 제1지시기
  indicator2: string; // 제2지시기
  subfields: SubField[];
}

export interface MarcData {
  leaderData?: LeaderData;
  variableFields?: MarcField[];
  setLeaderData: (leaderData: LeaderData) => void;
  setVariableField: (variableFields: MarcField[]) => void;
}

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
  const setVariableField = useContextSelector(
    MarcEditorContext,
    (context) => context?.setVariableField,
  );

  if (!leaderData || !variableFields || !setLeaderData || !setVariableField) {
    throw new Error(
      "useMarcEditor는 MarcEditorProvider 내부에서 사용해야 합니다.",
    );
  }

  return {
    leaderData,
    variableFields,
    setLeaderData,
    setVariableField,
  };
}
