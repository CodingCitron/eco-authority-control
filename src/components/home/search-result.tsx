import { useState } from "react";
import { Link } from "react-router";
import clsx from "clsx";

import Table, { type TableColumn } from "@/components/table";
import type {
  AuthoritySearchParams,
  AuthoritySearchResult,
} from "@/api/authority-search";
import { useAuthoritySearchQuery } from "@/hooks/use-authority-search-query";

import type {
  AuthorityRow,
  OrganizationRow,
  GeographyRow,
  SubjectRow,
} from "./search-result.types";

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

interface AuthoritySearchTableProps<T extends AuthoritySearchResult> {
  caption: string;
  columns: TableColumn<T>[];
  params: AuthoritySearchParams;
}

function AuthoritySearchTable<T extends AuthoritySearchResult>({
  caption,
  columns,
  params,
}: AuthoritySearchTableProps<T>) {
  const { data = [] } = useAuthoritySearchQuery<T>(params);

  return (
    <Table
      caption={caption}
      columns={columns}
      rows={data}
      getRowKey={(row) => row.controlNumber}
      getRowProps={(row) => ({
        "data-ctrl": row.controlNumber,
        "data-type": row.type,
        "data-heading": row.heading,
        "data-source": row.source,
      })}
    />
  );
}

const tabList = [
  {
    id: "personal",
    label: "개인명",
    content: <AuthoritySearchTable caption="개인명 전거 목록" columns={personalColumns} params={{ type: "personal" }} />,
  },
  {
    id: "corp",
    label: "단체명",
    content: <AuthoritySearchTable caption="단체명 전거 목록" columns={organizationColumns} params={{ type: "organization" }} />,
  },
  {
    id: "geo",
    label: "지리명",
    content: <AuthoritySearchTable caption="지리명 전거 목록" columns={geographyColumns} params={{ type: "geography" }} />,
  },
  {
    id: "subject",
    label: "주제명",
    content: <AuthoritySearchTable caption="주제명 전거 목록" columns={subjectColumns} params={{ type: "subject" }} />,
  },
];

export default function SearchResult() {
  const [currentTab, setCurrentTab] = useState(tabList[0]);

  return (
    <>
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        {tabList.map((tab) => {
          return (
            <li key={tab.id} className="nav-item" role="presentation">
              <button
                className={clsx("nav-link", {
                  active: currentTab.id === tab.id,
                })}
                id={`tab-${tab.id}`}
                data-bs-toggle="tab"
                data-bs-target={`#${tab.id}`}
                aria-controls={tab.id}
                onClick={() => setCurrentTab(tab)}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div
        className="tab-content border-start border-end border-bottom p-3 bg-white"
        id="myTabContent"
      >
        {tabList.map((tab) => (
          <div
            key={tab.id}
            className={clsx("tab-pane fade", {
              "active show": currentTab.id === tab.id,
            })}
            id={tab.id}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={tab.id}
          >
            <div className="table-responsive">{tab.content}</div>
          </div>
        ))}
      </div>
    </>
  );
}
