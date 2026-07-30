import type {
  AuthorityRow,
  GeographyRow,
  CorporationRow,
  SubjectRow,
} from "@/components/authority-search-page/authority-search-result.types";
import { authoritySearchMockData } from "./authority-search.mock";

export type AuthoritySearchType =
  | "personal"
  | "corporation"
  | "geography"
  | "subject";

export interface AuthoritySearchParams {
  type?: AuthoritySearchType;
  nationality?: string;
  controlNumber?: string;
  controlNumbers?: readonly string[];
  heading?: string;
}

export type AuthoritySearchResult =
  | AuthorityRow
  | CorporationRow
  | GeographyRow
  | SubjectRow;

export const authorityTypeLabels: Record<AuthoritySearchType, string> = {
  personal: "개인명",
  corporation: "단체명",
  geography: "지리명",
  subject: "주제명",
};

// 테스트 데이터
export async function fetchAuthoritySearchResults(
  params: AuthoritySearchParams,
): Promise<AuthoritySearchResult[]> {
  return authoritySearchMockData.filter(
    (row) =>
      (!params.type || row.type === authorityTypeLabels[params.type]) &&
      (!params.nationality || row.nationality === params.nationality) &&
      (!params.controlNumber ||
        row.controlNumber.includes(params.controlNumber)) &&
      (!params.controlNumbers ||
        params.controlNumbers.includes(row.controlNumber)) &&
      (!params.heading || row.heading.includes(params.heading)),
  );
}

// 검색 조건에 따라 데이터 가져오기
