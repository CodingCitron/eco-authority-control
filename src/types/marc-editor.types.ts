import type { MarcSubfield } from "marc-eco";
import type { AuthorityYesNo } from "@/types/authority.types";

/** 화면의 MARC 편집기와 각 전거 유형 mapper가 함께 사용하는 서브필드 타입이다. */
export type SubField = MarcSubfield;

/** marc-eco의 데이터 필드에 화면 편집용 판별자를 더한 타입이다. */
export interface MarcDataField {
  type: "data";
  tag: string;
  indicator1: string;
  indicator2: string;
  subfields: SubField[];
}

/** 화면에서 제어 필드와 데이터 필드를 구분하기 위한 제어 필드 타입이다. */
export interface MarcControlField {
  type: "control";
  tag: string;
  value: string;
}

export type MarcField = MarcControlField | MarcDataField;

/** MARC 레코드와 함께 전거 생성 API에 전달할 화면 입력값이다. */
export interface AuthorityCreateMetadata {
  acRegionCode?: string;
  biographyPrivateYn?: AuthorityYesNo;
  copyrightBlanketAgreeYn?: AuthorityYesNo;
  copyrightBlanketAgreeDate?: string;
}
