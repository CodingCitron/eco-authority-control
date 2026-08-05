import type {
  PersonalRow,
  GeographyRow,
  CorporationRow,
  SubjectRow,
} from "@/components/authority-search-page/authority-search-result.types";
import type { AuthoritySearchResult } from "../../api/authority-search";

const personalRows: PersonalRow[] = [
  {
    id: "1",
    type: "개인명",
    nationality: "한국",
    heading: "김소월",
    hanjaName: "金素月",
    years: "1902-1934",
    field: "한국 시;문학(372$a)1",
    source: "김소월 시집(670$a)",
    controlNumber: "KAC202600001",
    creator: "홍길동",
    modifiedBy: "김영희",
  },
  {
    id: "2",
    type: "개인명",
    nationality: "한국",
    heading: "김소월",
    hanjaName: "金素月",
    years: "1902-1934",
    field: "한국 시;문학(372$a)2",
    source: "김소월 전집(670$a)",
    controlNumber: "KAC202600002",
    creator: "이몽룡",
    modifiedBy: "김영희",
  },
];

const corporationRows: CorporationRow[] = [
  {
    id: "1",
    type: "단체명",
    nationality: "한국",
    heading: "헌법재판소.헌법재판연구원",
    organizationType: "학술단체(연구소.연구단체)",
    established: "20110101-",
    field: "법학(法學)(372 $a)",
    source: "헌법 연구 자료(670 $a)",
    controlNumber: "KAB201206266",
    creator: "홍길동",
    modifiedBy: "김영희",
  },
];

const geographyRows: GeographyRow[] = [
  {
    id: "1",
    type: "지리명",
    nationality: "한국",
    heading: "울릉도[鬱陵島]",
    source: "서울특별시 자료(670 $a)",
    controlNumber: "KAG201206266",
    creator: "홍길동",
    modifiedBy: "김영희",
  },
];

const subjectRows: SubjectRow[] = [
  {
    id: "1",
    type: "주제명",
    nationality: "한국",
    heading: "부작위(不作爲)",
    source: "법률용어사전(670 $a)",
    note: "이 표목은 법률상 의무가 있는 자가 ...",
    controlNumber: "KSH201400013",
    creator: "홍길동",
    modifiedBy: "김영희",
  },
  {
    id: "2",
    type: "주제명",
    nationality: "한국",
    heading: "부작위",
    source: "",
    note: "",
    controlNumber: "KSH201300011",
    creator: "관리자",
    modifiedBy: "김영신",
  },
];

export const authoritySearchMockData: AuthoritySearchResult[] = [
  ...personalRows,
  ...corporationRows,
  ...geographyRows,
  ...subjectRows,
];
