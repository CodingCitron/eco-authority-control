import {
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router";
import { createContext, useContextSelector } from "use-context-selector";

import type { TableColumn } from "@/components/table";
import type {
  AuthorityRow,
  GeographyRow,
  OrganizationRow,
  SubjectRow,
} from "@/components/search-page/search-result.types";
import AuthoritySearchTable from "@/components/search-page/authority-search-table";
import type { AuthoritySearchType } from "@/api/authority-search";
import AuthoritySelectionCheckbox from "@/components/search-page/authority-selection-checkbox";

const personalColumns: TableColumn<AuthorityRow>[] = [
  {
    header: "no",
    cell: (row) => row.id,
    sortValue: (row) => row.id,
  },
  {
    header: "선택",
    cell: (row) => (
      <AuthoritySelectionCheckbox
        controlNumber={row.controlNumber}
        heading={row.heading}
        inputId={`check-${row.controlNumber}`}
      />
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
      <AuthoritySelectionCheckbox
        controlNumber={row.controlNumber}
        heading={row.heading}
        inputId={`check-corp-${row.controlNumber}`}
      />
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
      <AuthoritySelectionCheckbox
        controlNumber={row.controlNumber}
        heading={row.heading}
        inputId={`check-geo-${row.controlNumber}`}
      />
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
      <AuthoritySelectionCheckbox
        controlNumber={row.controlNumber}
        heading={row.heading}
        inputId={`check-subj-${row.controlNumber}`}
      />
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

interface SearchTab {
  id: string;
  authorityType: AuthoritySearchType;
  label: string;
  content: ReactNode;
}

export const tabList: SearchTab[] = [
  {
    id: "personal",
    authorityType: "personal",
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
    authorityType: "organization",
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
    authorityType: "geography",
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
    authorityType: "subject",
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

interface SearchPageContextValue {
  currentTab: SearchTab;
  setCurrentTab: (tab: SearchTab) => void;
  selectedControlNumbers: readonly string[];
  toggleSelectedControlNumber: (controlNumber: string) => void;
  clearSelectedControlNumbers: () => void;
}

const SearchPageContext = createContext<SearchPageContextValue | null>(null);

export function SearchPageProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<SearchTab>(tabList[0]);
  const [selectedControlNumbers, setSelectedControlNumbers] = useState<
    string[]
  >([]);

  const toggleSelectedControlNumber = useCallback((controlNumber: string) => {
    setSelectedControlNumbers((current) =>
      current.includes(controlNumber)
        ? current.filter((value) => value !== controlNumber)
        : [...current, controlNumber],
    );
  }, []);

  const clearSelectedControlNumbers = useCallback(() => {
    setSelectedControlNumbers([]);
  }, []);

  const changeCurrentTab = useCallback((tab: SearchTab) => {
    setCurrentTab(tab);
    clearSelectedControlNumbers();
  }, [clearSelectedControlNumbers]);

  return (
    <SearchPageContext.Provider
      value={{
        currentTab,
        setCurrentTab: changeCurrentTab,
        selectedControlNumbers,
        toggleSelectedControlNumber,
        clearSelectedControlNumbers,
      }}
    >
      {children}
    </SearchPageContext.Provider>
  );
}

export function useSearchPage() {
  const currentTab = useContextSelector(
    SearchPageContext,
    (context) => context?.currentTab,
  );

  const setCurrentTab = useContextSelector(
    SearchPageContext,
    (context) => context?.setCurrentTab,
  );

  const selectedControlNumbers = useContextSelector(
    SearchPageContext,
    (context) => context?.selectedControlNumbers,
  );

  const toggleSelectedControlNumber = useContextSelector(
    SearchPageContext,
    (context) => context?.toggleSelectedControlNumber,
  );

  const clearSelectedControlNumbers = useContextSelector(
    SearchPageContext,
    (context) => context?.clearSelectedControlNumbers,
  );

  if (
    !currentTab ||
    !setCurrentTab ||
    !selectedControlNumbers ||
    !toggleSelectedControlNumber ||
    !clearSelectedControlNumbers
  ) {
    throw new Error(
      "useSearchPage는 SearchPageProvider 내부에서 사용해야 합니다.",
    );
  }

  return {
    currentTab,
    setCurrentTab,
    selectedControlNumbers,
    toggleSelectedControlNumber,
    clearSelectedControlNumbers,
  };
}

export { SearchPageContext };
