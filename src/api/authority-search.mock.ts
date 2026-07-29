import type {
  AuthorityRow,
  GeographyRow,
  OrganizationRow,
  SubjectRow,
} from "@/components/home/search-result.types";
import type { AuthoritySearchResult } from "./authority-search";

const personalRows: AuthorityRow[] = [
  {
    id: "1",
    type: "개인명",
    nationality: "한국",
    heading: "김소월",
    author: "김정식",
    years: "1902-1934",
    field: "한국 현대문학(372$a)",
    source: "김소월 전집(670$a)",
    controlNumber: "KAC202600001",
    creator: "관리자",
    modifiedBy: "김옥하",
  },
  {
    id: "2",
    type: "개인명",
    nationality: "한국",
    heading: "김소월",
    author: "김정식",
    years: "1902-1934",
    field: "한국 현대문학(372$a)",
    source: "김소월 전집(670$a)",
    controlNumber: "KAC202600002",
    creator: "관리자",
    modifiedBy: "김옥하",
  },
];

const organizationRows: OrganizationRow[] = [
  {
    id: "1",
    type: "단체명",
    nationality: "한국",
    heading: "대한법학회",
    organizationType: "학술단체",
    established: "20110101-",
    field: "법학(372 $a)",
    source: "대한법학회 자료(670 $a)",
    controlNumber: "KAB201206266",
    creator: "관리자",
    modifiedBy: "김영신",
  },
];

const geographyRows: GeographyRow[] = [
  {
    id: "1",
    type: "지리명",
    nationality: "한국",
    heading: "서울특별시",
    source: "서울특별시 자료(670 $a)",
    controlNumber: "KAG201206266",
    creator: "관리자",
    modifiedBy: "김영신",
  },
];

const subjectRows: SubjectRow[] = [
  {
    id: "1",
    type: "주제명",
    nationality: "한국",
    heading: "부모위",
    source: "법률용어사전(670 $a)",
    note: "표목에 대한 설명이 있는 주제명입니다.",
    controlNumber: "KSH201400013",
    creator: "관리자",
    modifiedBy: "김영신",
  },
  {
    id: "2",
    type: "주제명",
    nationality: "한국",
    heading: "부모위",
    source: "",
    note: "",
    controlNumber: "KSH201300011",
    creator: "관리자",
    modifiedBy: "김영신",
  },
];

export const authoritySearchMockData: AuthoritySearchResult[] = [
  ...personalRows,
  ...organizationRows,
  ...geographyRows,
  ...subjectRows,
];
