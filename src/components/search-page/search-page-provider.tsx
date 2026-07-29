import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Link } from "react-router";

import type { TableColumn } from "@/components/table";
import type {
  AuthorityRow,
  GeographyRow,
  OrganizationRow,
  SubjectRow,
} from "@/components/search-page/search-result.types";
import AuthoritySearchTable from "@/components/search-page/authority-search-table";

const personalColumns: TableColumn<AuthorityRow>[] = [
  {
    header: "no",
    cell: (row) => row.id,
    sortValue: (row) => row.id,
  },
  {
    header: "선택",
    cell: (row) => (
      <>
        <label htmlFor={`check${row.id}`} className="visually-hidden">
          {row.heading} 선택
        </label>
        <input type="checkbox" id={`check${row.id}`} />
      </>
    ),
  },
  { header: "전거유형", cell: (row) => row.type, sortValue: (row) => row.type },
  {
    header: "국적",
    cell: (row) => row.nationality,
    sortValue: (row) => row.nationality,
  },
  {
    header: "채택표목",
    className: "text-start fw-bold text-primary",
    cell: (row) => row.heading,
    sortValue: (row) => row.heading,
  },
  {
    header: "저자명",
    cell: (row) => row.author,
    sortValue: (row) => row.author,
  },
  { header: "생몰년", cell: (row) => row.years, sortValue: (row) => row.years },
  { header: "분야", cell: (row) => row.field, sortValue: (row) => row.field },
  {
    header: "정보원",
    cell: (row) => row.source,
    sortValue: (row) => row.source,
  },
  {
    header: "제어번호",
    cell: (row) => row.controlNumber,
    sortValue: (row) => row.controlNumber,
  },
  {
    header: "입력자",
    cell: (row) => row.creator,
    sortValue: (row) => row.creator,
  },
  {
    header: "수정자",
    cell: (row) => row.modifiedBy,
    sortValue: (row) => row.modifiedBy,
  },
  {
    header: "관리",
    cell: () => (
      <div className="d-flex gap-1 justify-content-center">
        <Link
          to="form_personal.html"
          className="btn btn-sm btn-light-warning py-0"
        >
          수정
        </Link>
        <button type="button" className="btn btn-sm btn-light-danger py-0">
          삭제
        </button>
      </div>
    ),
  },
];

const organizationColumns: TableColumn<OrganizationRow>[] = [
  { header: "no", cell: (row) => row.id, sortValue: (row) => row.id },
  {
    header: "선택",
    cell: (row) => (
      <>
        <label htmlFor={`check-corp-${row.id}`} className="visually-hidden">
          {row.heading} 선택
        </label>
        <input type="checkbox" id={`check-corp-${row.id}`} />
      </>
    ),
  },
  { header: "전거유형", cell: (row) => row.type, sortValue: (row) => row.type },
  {
    header: "전거지역",
    cell: (row) => row.nationality,
    sortValue: (row) => row.nationality,
  },
  {
    header: "채택표목",
    cell: (row) => row.heading,
    sortValue: (row) => row.heading,
    className: "text-start fw-bold text-primary",
  },
  {
    header: "단체유형",
    cell: (row) => row.organizationType,
    sortValue: (row) => row.organizationType,
  },
  {
    header: "설립/해산일",
    cell: (row) => row.established,
    sortValue: (row) => row.established,
  },
  { header: "분야", cell: (row) => row.field, sortValue: (row) => row.field },
  {
    header: "정보원",
    cell: (row) => row.source,
    sortValue: (row) => row.source,
  },
  {
    header: "제어번호",
    cell: (row) => row.controlNumber,
    sortValue: (row) => row.controlNumber,
  },
  {
    header: "입력자",
    cell: (row) => row.creator,
    sortValue: (row) => row.creator,
  },
  {
    header: "수정자",
    cell: (row) => row.modifiedBy,
    sortValue: (row) => row.modifiedBy,
  },
  {
    header: "관리",
    cell: () => (
      <div className="d-flex gap-1 justify-content-center">
        <Link to="form_corp.html" className="btn btn-sm btn-light-warning py-0">
          수정
        </Link>
        <button type="button" className="btn btn-sm btn-light-danger py-0">
          삭제
        </button>
      </div>
    ),
  },
];

const geographyColumns: TableColumn<GeographyRow>[] = [
  { header: "no", cell: (row) => row.id, sortValue: (row) => row.id },
  {
    header: "선택",
    cell: (row) => (
      <>
        <label htmlFor={`check-geo-${row.id}`} className="visually-hidden">
          {row.heading} 선택
        </label>
        <input type="checkbox" id={`check-geo-${row.id}`} />
      </>
    ),
  },
  { header: "전거유형", cell: (row) => row.type, sortValue: (row) => row.type },
  {
    header: "전거지역",
    cell: (row) => row.nationality,
    sortValue: (row) => row.nationality,
  },
  {
    header: "채택표목",
    cell: (row) => row.heading,
    sortValue: (row) => row.heading,
    className: "text-start fw-bold text-primary",
  },
  {
    header: "정보원",
    cell: (row) => row.source,
    sortValue: (row) => row.source,
  },
  {
    header: "제어번호",
    cell: (row) => row.controlNumber,
    sortValue: (row) => row.controlNumber,
  },
  {
    header: "입력자",
    cell: (row) => row.creator,
    sortValue: (row) => row.creator,
  },
  {
    header: "수정자",
    cell: (row) => row.modifiedBy,
    sortValue: (row) => row.modifiedBy,
  },
  {
    header: "관리",
    cell: () => (
      <div className="d-flex gap-1 justify-content-center">
        <Link to="form_geo.html" className="btn btn-sm btn-light-warning py-0">
          수정
        </Link>
        <button type="button" className="btn btn-sm btn-light-danger py-0">
          삭제
        </button>
      </div>
    ),
  },
];

const subjectColumns: TableColumn<SubjectRow>[] = [
  { header: "no", cell: (row) => row.id, sortValue: (row) => row.id },
  {
    header: "선택",
    cell: (row) => (
      <>
        <label htmlFor={`check-subj-${row.id}`} className="visually-hidden">
          {row.heading} 선택
        </label>
        <input type="checkbox" id={`check-subj-${row.id}`} />
      </>
    ),
  },
  { header: "전거유형", cell: (row) => row.type, sortValue: (row) => row.type },
  {
    header: "전거지역",
    cell: (row) => row.nationality,
    sortValue: (row) => row.nationality,
  },
  {
    header: "채택표목",
    cell: (row) => row.heading,
    sortValue: (row) => row.heading,
    className: "text-start fw-bold text-primary",
  },
  {
    header: "정보원",
    cell: (row) => row.source,
    sortValue: (row) => row.source,
  },
  {
    header: "일반주기",
    cell: (row) => (
      <span className="text-truncate d-block" style={{ maxWidth: "200px" }}>
        {row.note}
      </span>
    ),
    sortValue: (row) => row.note,
  },
  {
    header: "제어번호",
    cell: (row) => row.controlNumber,
    sortValue: (row) => row.controlNumber,
  },
  {
    header: "입력자",
    cell: (row) => row.creator,
    sortValue: (row) => row.creator,
  },
  {
    header: "수정자",
    cell: (row) => row.modifiedBy,
    sortValue: (row) => row.modifiedBy,
  },
  {
    header: "관리",
    cell: () => (
      <div className="d-flex gap-1 justify-content-center">
        <Link
          to="form_subject.html"
          className="btn btn-sm btn-light-warning py-0"
        >
          수정
        </Link>
        <button type="button" className="btn btn-sm btn-light-danger py-0">
          삭제
        </button>
      </div>
    ),
  },
];

export const tabList = [
  {
    id: "personal",
    label: "개인명",
    content: (
      <AuthoritySearchTable
        caption="개인명 전거 목록"
        columns={personalColumns}
        params={{ type: "personal" }}
      />
    ),
  },
  {
    id: "corp",
    label: "단체명",
    content: (
      <AuthoritySearchTable
        caption="단체명 전거 목록"
        columns={organizationColumns}
        params={{ type: "organization" }}
      />
    ),
  },
  {
    id: "geo",
    label: "지리명",
    content: (
      <AuthoritySearchTable
        caption="지리명 전거 목록"
        columns={geographyColumns}
        params={{ type: "geography" }}
      />
    ),
  },
  {
    id: "subject",
    label: "주제명",
    content: (
      <AuthoritySearchTable
        caption="주제명 전거 목록"
        columns={subjectColumns}
        params={{ type: "subject" }}
      />
    ),
  },
];

type SearchTab = (typeof tabList)[number];

interface SearchPageContextValue {
  currentTab: SearchTab;
  setCurrentTab: Dispatch<SetStateAction<SearchTab>>;
}

const SearchPageContext = createContext<SearchPageContextValue | null>(null);

export function SearchPageProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<SearchTab>(tabList[0]);

  return (
    <SearchPageContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </SearchPageContext.Provider>
  );
}

export function useSearchPage() {
  const context = useContext(SearchPageContext);

  if (!context) {
    throw new Error(
      "useSearchPage는 SearchPageProvider안에서 사용해야 합니다.",
    );
  }

  return context;
}

export { SearchPageContext };
