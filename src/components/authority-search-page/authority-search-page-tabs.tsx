import { Link } from "react-router";
import { css } from "styled-system/css";

import type {
  PersonalRow,
  GeographyRow,
  CorporationRow,
  SubjectRow,
} from "@/components/authority-search-page/authority-search-result.types";
import AuthoritySearchTable from "@/components/authority-search-page/authority-search-table";
import AuthoritySelectionCheckbox from "@/components/authority-search-page/authority-selection-checkbox";
import type { SearchTab } from "@/components/authority-search-page/authority-search-page-context";
import type { TableColumn } from "@/components/ui/table";
import type { tab } from "@testing-library/user-event/dist/cjs/convenience/tab.js";

const personalColumns: TableColumn<PersonalRow>[] = [
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
    header: "전거지역",
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
    header: "한자명",
    cell: (row) => row.hanjaName,
    sortValue: (row) => row.hanjaName,
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

const corporationColumns: TableColumn<CorporationRow>[] = [
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
    cell: (row) => <div className="text-truncate">{row.note}</div>,
    sortValue: (row) => row.note,
    className: css({ maxWidth: "200px" }),
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

export const tabList: SearchTab[] = [
  {
    id: "personal",
    label: "개인명",
    content: (
      <AuthoritySearchTable
        caption="개인명 전거 목록"
        columns={personalColumns}
      />
    ),
  },
  {
    id: "corporation",
    label: "단체명",
    content: (
      <AuthoritySearchTable
        caption="단체명 전거 목록"
        columns={corporationColumns}
      />
    ),
  },
  {
    id: "geography",
    label: "지리명",
    content: (
      <AuthoritySearchTable
        caption="지리명 전거 목록"
        columns={geographyColumns}
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
      />
    ),
  },
];
