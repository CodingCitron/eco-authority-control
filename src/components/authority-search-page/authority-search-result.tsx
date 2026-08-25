import { Link, useSearchParams } from "react-router";

import { useCurrentAuthoritySearch } from "@/hooks/use-authority-search";

import {
  type PersonalRow,
  type GeographyRow,
  type CorporationRow,
  type SubjectRow,
  authorityTypeLabels,
  type AuthoritySearchType,
  type AuthorityRecord,
} from "@/types/authority-search.types";

import { useSearchPage } from "./authority-search-page-context";

import AuthoritySelectionCheckbox from "@/components/authority-search-page/authority-selection-checkbox";
import type { TableColumn } from "@/components/ui/table";
import Table from "@/components/ui/table";
import AppPagination from "@/components/ui/pagination";
import { AuthorityDeleteButton } from "./authority-delete-modal";

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
        recordKey={row.recKey}
        heading={row?.headingName || ""}
        inputId={`check-${row.recKey}`}
      />
    ),
  },
  {
    header: "전거유형",
    cell: (row) => authorityTypeLabels[row.acType],
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
    cell: (row) => (
      <>
        <Link
          to={`personal/edit?recKey=${row.recKey}`}
          className="btn btn-sm btn-light-warning py-0"
        >
          수정
        </Link>{" "}
        <AuthorityDeleteButton
          reckey={row.recKey}
          controlNumber={row.acControlNo}
          className="btn btn-sm btn-light-danger py-0"
        >
          삭제
        </AuthorityDeleteButton>
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
        recordKey={row.recKey}
        heading={row?.headingName || ""}
        inputId={`check-corp-${row.recKey}`}
      />
    ),
  },
  {
    header: "전거유형",
    cell: (row) => authorityTypeLabels[row.acType],
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
    cell: (row) => (
      <>
        <Link
          to={`corporation/edit?recKey=${row.recKey}`}
          className="btn btn-sm btn-light-warning py-0"
        >
          수정
        </Link>{" "}
        <AuthorityDeleteButton
          reckey={row.recKey}
          controlNumber={row.acControlNo}
          type="button"
          className="btn btn-sm btn-light-danger py-0"
        >
          삭제
        </AuthorityDeleteButton>
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
        recordKey={row.recKey}
        heading={row?.headingName || ""}
        inputId={`check-geo-${row.recKey}`}
      />
    ),
  },
  {
    header: "전거유형",
    cell: (row) => authorityTypeLabels[row.acType],
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
    cell: (row) => (
      <>
        <Link
          to={`geography/edit?recKey=${row.recKey}`}
          className="btn btn-sm btn-light-warning py-0"
        >
          수정
        </Link>{" "}
        <AuthorityDeleteButton
          reckey={row.recKey}
          controlNumber={row.acControlNo}
          type="button"
          className="btn btn-sm btn-light-danger py-0"
        >
          삭제
        </AuthorityDeleteButton>
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
        recordKey={row.recKey}
        heading={row?.headingName || ""}
        inputId={`check-subj-${row.recKey}`}
      />
    ),
  },
  {
    header: "전거유형",
    cell: (row) => authorityTypeLabels[row.acType],
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
    cell: (row) => (
      <>
        <Link
          to={`subject/edit?recKey=${row.recKey}`}
          className="btn btn-sm btn-light-warning py-0"
        >
          수정
        </Link>{" "}
        <AuthorityDeleteButton
          reckey={row.recKey}
          controlNumber={row.acControlNo}
          type="button"
          className="btn btn-sm btn-light-danger py-0"
        >
          삭제
        </AuthorityDeleteButton>
      </>
    ),
  },
];

type AuthorityRowByType = {
  "0": PersonalRow;
  "1": CorporationRow;
  "5": GeographyRow;
  "4": SubjectRow;
};

type TableConfig = {
  [K in AuthoritySearchType]: {
    caption: string;
    columns: TableColumn<AuthorityRowByType[K]>[];
  };
};

const tableConfig: TableConfig = {
  "0": {
    caption: "개인명 전거 목록",
    columns: personalColumns,
  },
  "1": {
    caption: "단체명 전거 목록",
    columns: corporationColumns,
  },
  "5": {
    caption: "지리명 전거 목록",
    columns: geographyColumns,
  },
  "4": {
    caption: "주제명 전거 목록",
    columns: subjectColumns,
  },
};

function AuthorityTable({
  type,
  rows,
}: {
  type: AuthoritySearchType;
  rows: readonly AuthorityRecord[];
}) {
  switch (type) {
    case "0":
      return (
        <Table<PersonalRow>
          caption={tableConfig["0"].caption}
          columns={tableConfig["0"].columns}
          rows={rows.filter((row): row is PersonalRow => row.acType === "0")}
          getRowKey={(row) => row.recKey}
        />
      );
    case "1":
      return (
        <Table<CorporationRow>
          caption={tableConfig["1"].caption}
          columns={tableConfig["1"].columns}
          rows={rows.filter((row): row is CorporationRow => row.acType === "1")}
          getRowKey={(row) => row.recKey}
        />
      );
    case "5":
      return (
        <Table<GeographyRow>
          caption={tableConfig["5"].caption}
          columns={tableConfig["5"].columns}
          rows={rows.filter((row): row is GeographyRow => row.acType === "5")}
          getRowKey={(row) => row.recKey}
        />
      );
    case "4":
      return (
        <Table<SubjectRow>
          caption={tableConfig["4"].caption}
          columns={tableConfig["4"].columns}
          rows={rows.filter((row): row is SubjectRow => row.acType === "4")}
          getRowKey={(row) => row.recKey}
        />
      );
  }
}

export default function AuthoritySearchResult() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { clearSelectedRecordKeys } = useSearchPage();

  const { acType, data, isLoading, isError, isSearched } =
    useCurrentAuthoritySearch();

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
        전거 데이터를 불러오지 못했습니다.
        <button type="button" className="btn btn-outline-secondary">
          다시 시도
        </button>
      </div>
    );
  }

  const contents = data?.data.items ?? [];
  const totalCount = data?.data.total ?? 0;

  if (contents.length === 0) {
    return (
      <div className="pt-2">
        <p>검색된 전거 데이터가 없습니다.</p>
      </div>
    );
  }

  const page = Number(searchParams.get("page")) || 1;
  const display = Number(searchParams.get("display")) || 20;

  const handlePageChange = (nextPage: number) => {
    clearSelectedRecordKeys();

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));

    setSearchParams(nextParams);
  };

  return (
    <div className="pt-2 overflow-auto">
      <AuthorityTable type={acType} rows={contents} />
      <div className="d-flex justify-content-center">
        <AppPagination
          page={page}
          pageSize={display}
          totalCount={totalCount}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
