import { Link, useSearchParams } from "react-router";
import { css } from "styled-system/css";

import { useCurrentAuthoritySearchQuery } from "@/hooks/use-authority-search-query";

import type {
  PersonalRow,
  GeographyRow,
  CorporationRow,
  SubjectRow,
} from "@/types/authority-search.types";

import { useSearchPage } from "./authority-search-page-context";

import AuthoritySelectionCheckbox from "@/components/authority-search-page/authority-selection-checkbox";
import type { TableColumn } from "@/components/ui/table";
import Table from "@/components/ui/table";
import AppPagination from "@/components/ui/pagination";

export const personalColumns: TableColumn<PersonalRow>[] = [
  {
    header: "no",
    cell: (row) => row.recKey,
    sortValue: (row) => row.recKey,
  },
  {
    header: "선택",
    cell: (row) => (
      <AuthoritySelectionCheckbox
        controlNumber={row.acControlNo}
        heading={row.headingName}
        inputId={`check-${row.acControlNo}`}
      />
    ),
  },
  {
    header: "전거유형",
    cell: (row) => row.acType,
    sortValue: (row) => row.acType,
  },
  {
    header: "전거지역",
    cell: (row) => row.acRegionDesc,
    sortValue: (row) => row.acRegionDesc,
  },
  {
    header: "채택표목",
    className: "text-start fw-bold text-primary",
    cell: (row) => row.headingName,
    sortValue: (row) => row.headingName,
  },
  {
    header: "한자명",
    cell: (row) => row.hanjaName,
    sortValue: (row) => row.hanjaName,
  },
  {
    header: "생몰년",
    cell: (row) => row.birthDeathDate,
    sortValue: (row) => row.birthDeathDate,
  },
  {
    header: "분야",
    cell: (row) => row.activityField,
    sortValue: (row) => row.activityField,
  },
  {
    header: "정보원",
    cell: (row) => row.sourceDataFound,
    sortValue: (row) => row.sourceDataFound,
  },
  {
    header: "제어번호",
    cell: (row) => row.acControlNo,
    sortValue: (row) => row.acControlNo,
  },
  {
    header: "입력자",
    cell: (row) => row.firstWorker,
    sortValue: (row) => row.firstWorker,
  },
  {
    header: "수정자",
    cell: (row) => row.lastWorker,
    sortValue: (row) => row.lastWorker,
  },
  {
    header: "관리",
    cell: () => (
      <>
        <Link
          to="form_personal.html"
          className="btn btn-sm btn-light-warning py-0"
        >
          수정
        </Link>{" "}
        <button type="button" className="btn btn-sm btn-light-danger py-0">
          삭제
        </button>
      </>
    ),
  },
];

export const corporationColumns: TableColumn<CorporationRow>[] = [
  { header: "no", cell: (row) => row.recKey, sortValue: (row) => row.recKey },
  {
    header: "선택",
    cell: (row) => (
      <AuthoritySelectionCheckbox
        controlNumber={row.acControlNo}
        heading={row.headingName}
        inputId={`check-corp-${row.acControlNo}`}
      />
    ),
  },
  {
    header: "전거유형",
    cell: (row) => row.acType,
    sortValue: (row) => row.acType,
  },
  {
    header: "전거지역",
    cell: (row) => row.acRegionDesc,
    sortValue: (row) => row.acRegionDesc,
  },
  {
    header: "채택표목",
    cell: (row) => row.headingName,
    sortValue: (row) => row.headingName,
    className: "text-start fw-bold text-primary",
  },
  {
    header: "단체유형",
    cell: (row) => row.organizationType,
    sortValue: (row) => row.organizationType,
  },
  {
    header: "설립일/폐쇄일",
    cell: (row) => row.establishmentDate,
    sortValue: (row) => row.establishmentDate,
  },
  {
    header: "분야",
    cell: (row) => row.activityField,
    sortValue: (row) => row.activityField,
  },
  {
    header: "정보원",
    cell: (row) => row.sourceDataFound,
    sortValue: (row) => row.sourceDataFound,
  },
  {
    header: "제어번호",
    cell: (row) => row.acControlNo,
    sortValue: (row) => row.acControlNo,
  },
  {
    header: "입력자",
    cell: (row) => row.firstWorker,
    sortValue: (row) => row.firstWorker,
  },
  {
    header: "수정자",
    cell: (row) => row.lastWorker,
    sortValue: (row) => row.lastWorker,
  },
  {
    header: "관리",
    cell: () => (
      <>
        <Link to="form_corp.html" className="btn btn-sm btn-light-warning py-0">
          수정
        </Link>{" "}
        <button type="button" className="btn btn-sm btn-light-danger py-0">
          삭제
        </button>
      </>
    ),
  },
];

export const geographyColumns: TableColumn<GeographyRow>[] = [
  { header: "no", cell: (row) => row.recKey, sortValue: (row) => row.recKey },
  {
    header: "선택",
    cell: (row) => (
      <AuthoritySelectionCheckbox
        controlNumber={row.acControlNo}
        heading={row.headingName}
        inputId={`check-geo-${row.acControlNo}`}
      />
    ),
  },
  {
    header: "전거유형",
    cell: (row) => row.acType,
    sortValue: (row) => row.acType,
  },
  {
    header: "전거지역",
    cell: (row) => row.acRegionDesc,
    sortValue: (row) => row.acRegionDesc,
  },
  {
    header: "채택표목",
    cell: (row) => row.headingName,
    sortValue: (row) => row.headingName,
    className: "text-start fw-bold text-primary",
  },
  {
    header: "정보원",
    cell: (row) => row.sourceDataFound,
    sortValue: (row) => row.sourceDataFound,
  },
  {
    header: "제어번호",
    cell: (row) => row.acControlNo,
    sortValue: (row) => row.acControlNo,
  },
  {
    header: "입력자",
    cell: (row) => row.firstWorker,
    sortValue: (row) => row.firstWorker,
  },
  {
    header: "수정자",
    cell: (row) => row.lastWorker,
    sortValue: (row) => row.lastWorker,
  },
  {
    header: "관리",
    cell: () => (
      <>
        <Link to="form_geo.html" className="btn btn-sm btn-light-warning py-0">
          수정
        </Link>{" "}
        <button type="button" className="btn btn-sm btn-light-danger py-0">
          삭제
        </button>
      </>
    ),
  },
];

export const subjectColumns: TableColumn<SubjectRow>[] = [
  { header: "no", cell: (row) => row.recKey, sortValue: (row) => row.recKey },
  {
    header: "선택",
    cell: (row) => (
      <AuthoritySelectionCheckbox
        controlNumber={row.acControlNo}
        heading={row.headingName}
        inputId={`check-subj-${row.acControlNo}`}
      />
    ),
  },
  {
    header: "전거유형",
    cell: (row) => row.acType,
    sortValue: (row) => row.acType,
  },
  {
    header: "전거지역",
    cell: (row) => row.acRegionDesc,
    sortValue: (row) => row.acRegionDesc,
  },
  {
    header: "채택표목",
    cell: (row) => row.headingName,
    sortValue: (row) => row.headingName,
    className: "text-start fw-bold text-primary",
  },
  {
    header: "정보원",
    cell: (row) => row.sourceDataFound,
    sortValue: (row) => row.sourceDataFound,
  },
  // {
  //   header: "일반주기",
  //   cell: (row) => <div className="text-truncate">{row.note}</div>,
  //   sortValue: (row) => row.note,
  //   className: css({ maxWidth: "200px" }),
  // },
  {
    header: "제어번호",
    cell: (row) => row.acControlNo,
    sortValue: (row) => row.acControlNo,
  },
  {
    header: "입력자",
    cell: (row) => row.firstWorker,
    sortValue: (row) => row.firstWorker,
  },
  {
    header: "수정자",
    cell: (row) => row.lastWorker,
    sortValue: (row) => row.lastWorker,
  },
  {
    header: "관리",
    cell: () => (
      <>
        <Link
          to="form_subject.html"
          className="btn btn-sm btn-light-warning py-0"
        >
          수정
        </Link>{" "}
        <button type="button" className="btn btn-sm btn-light-danger py-0">
          삭제
        </button>
      </>
    ),
  },
];

const tableConfig = {
  personal: {
    caption: "개인명 전거 목록",
    columns: personalColumns,
  },
  corporation: {
    caption: "단체명 전거 목록",
    columns: corporationColumns,
  },
  geography: {
    caption: "지리명 전거 목록",
    columns: geographyColumns,
  },
  subject: {
    caption: "주제명 전거 목록",
    columns: subjectColumns,
  },
};

export default function AuthoritySearchResult() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { clearSelectedControlNumbers } = useSearchPage();

  const { type, data, isLoading, isError, isSearched } =
    useCurrentAuthoritySearchQuery();

  if (!isSearched) {
    return (
      <div className="pt-2">
        <p>찾기 버튼을 클릭하면 전거를 검색할 수 있습니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-2">
        <p>전거 데이터를 불러오는 중입니다.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-2">
        <p className="alert alert-danger" role="alert">
          전거 데이터를 불러오지 못했습니다.
        </p>
        <button type="button" className="btn btn-outline-secondary">
          다시 시도
        </button>
      </div>
    );
  }

  const contents = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;

  if (contents.length === 0) {
    return (
      <div className="pt-2">
        <p>검색된 전거 데이터가 없습니다.</p>
      </div>
    );
  }

  const config = tableConfig[type];
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const handlePageChange = (nextPage: number) => {
    clearSelectedControlNumbers();

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));

    setSearchParams(nextParams);
  };

  return (
    <div className="pt-2 overflow-auto">
      <Table
        caption={config.caption}
        columns={config.columns}
        rows={contents}
        getRowKey={(row) => row.acControlNo}
      />
      <div className="d-flex justify-content-center">
        <AppPagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
