import { useState, type SubmitEvent } from "react";
import { Button, Modal } from "react-bootstrap";

import type { AuthoritySearchQueryParams } from "@/api/authority-search";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import { useAuthoritySearch } from "@/hooks/use-authority-search";
import type { AuthorityDetailData } from "@/types/authority-detail.types";
import {
  authorityTypeLabels,
  isValidAcType,
  type AuthoritySearchType,
} from "@/types/authority.types";

import {
  create5XXReferenceFields,
  type AuthorityReferenceFieldTag,
  type AuthorityReferenceRelationCode,
} from "../ui/authority-reference-heading.mapper";
import BaseModal from "../ui/base-modal";
import { HanjaToHangulModalButton } from "../ui/hanja-to-hangul-modal";
import MarcFontSizeSelect, {
  defaultFontSize,
} from "../ui/marc-font-size-select";
import OverflowTooltip from "../ui/overflow-tooltip";
import MarcRecordPreview from "../ui/record-preview";
import { useSearchPage } from "./authority-search-page-context";

const authorityControlSearchDefaultParams: AuthoritySearchQueryParams = {
  acType: "4",
  acRegionCode: "0",
  searchType: "CONTAINS",
  page: "1",
  display: "10",
};

const referenceTagByAuthorityType: Record<
  AuthoritySearchType,
  AuthorityReferenceFieldTag
> = {
  "0": "500",
  "1": "510",
  "5": "551",
  "4": "550",
};

type AuthorityReferenceField =
  AuthorityDetailData["record"]["dataFields"][number];

function getReferenceFieldDescription(
  field: Pick<AuthorityReferenceField, "subfields">,
) {
  return field.subfields
    .filter(({ code }) => code === "a" || code === "b")
    .map(({ value }) => value)
    .join(" ");
}

function getReferenceFieldKey(field: AuthorityReferenceField) {
  return JSON.stringify({
    tag: field.tag,
    ind1: field.ind1,
    ind2: field.ind2,
    subfields: field.subfields,
  });
}

export function AuthorityControlButton() {
  const { selectedRecordKeys } = useSearchPage();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    if (selectedRecordKeys.length !== 1) {
      alert(
        "전거통제는 1건씩 진행합니다. 통제할 전거자료를 정확히 1건 선택해주세요.",
      );
      return;
    }

    setModalIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-dark btn-sm"
        onClick={handleClick}
      >
        <i className="bi bi-link-45deg me-1" aria-hidden="true"></i>
        전거통제
      </button>
      <AuthorityControlModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export default function AuthorityControlModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <BaseModal show={show} onHide={onHide}>
      <AuthorityControlModalBody onHide={onHide} />
    </BaseModal>
  );
}

export function AuthorityControlModalBody({ onHide }: { onHide: () => void }) {
  const { selectedRecordKeys } = useSearchPage();
  const controlledRecordKey = selectedRecordKeys[0] ?? "";

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams, setSearchParams] =
    useState<AuthoritySearchQueryParams>();
  const [searchAuthorityType, setSearchAuthorityType] =
    useState<AuthoritySearchType>();
  const [selectedRecordKey, setSelectedRecordKey] = useState("");
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [relationCode, setRelationCode] =
    useState<AuthorityReferenceRelationCode>("");
  const [temporaryReferenceFields, setTemporaryReferenceFields] = useState<
    AuthorityReferenceField[]
  >([]);

  const {
    data: controlledDetailResponse,
    isLoading: isControlledDetailLoading,
    isError: isControlledDetailError,
  } = useAuthorityDetail(controlledRecordKey);
  const controlledDetail = controlledDetailResponse?.data;
  const controlledAuthorityType = isValidAcType(controlledDetail?.acType)
    ? controlledDetail.acType
    : undefined;
  const referenceTag = controlledAuthorityType
    ? referenceTagByAuthorityType[controlledAuthorityType]
    : undefined;
  const activeSearchAuthorityType =
    searchAuthorityType ?? controlledAuthorityType;

  const {
    data: searchResponse,
    isFetching: isSearchFetching,
    isError: isSearchError,
    refetch,
  } = useAuthoritySearch(searchParams ?? authorityControlSearchDefaultParams, {
    enabled: searchParams !== undefined,
  });
  const {
    data: selectedDetailResponse,
    isFetching: isSelectedDetailFetching,
    isError: isSelectedDetailError,
  } = useAuthorityDetail(selectedRecordKey, {
    enabled: Boolean(selectedRecordKey),
  });

  const searchResult = searchResponse?.data;
  const records = searchParams ? (searchResult?.items ?? []) : [];
  const currentPage = searchResult?.page ?? Number(searchParams?.page ?? 1);
  const totalPages = Math.max(searchResult?.totalPages ?? 1, 1);
  const existingReferenceFields = referenceTag
    ? (controlledDetail?.record.dataFields.filter(
        (field) => field.tag === referenceTag,
      ) ?? [])
    : [];
  const referenceFields: AuthorityReferenceField[] = [
    ...existingReferenceFields,
    ...temporaryReferenceFields,
  ];

  const selectedDetailMessage = !selectedRecordKey
    ? "검색 결과에서 전거를 선택해 주세요."
    : isSelectedDetailError
      ? "선택한 전거의 상세 정보를 불러오지 못했습니다."
      : isSelectedDetailFetching
        ? "선택한 전거의 상세 정보를 불러오는 중입니다."
        : "선택한 전거의 상세 정보가 없습니다.";

  const handleSearch = (event: SubmitEvent) => {
    event.preventDefault();
    if (!activeSearchAuthorityType || !referenceTag) {
      return;
    }

    const normalizedKeyword = searchKeyword.trim();
    const nextParams: AuthoritySearchQueryParams = {
      ...authorityControlSearchDefaultParams,
      acType: activeSearchAuthorityType,
      ...(normalizedKeyword && { searchKeyword: normalizedKeyword }),
    };
    const isSameSearch =
      searchParams?.acType === nextParams.acType &&
      searchParams?.searchKeyword === nextParams.searchKeyword &&
      searchParams?.page === nextParams.page;

    setSelectedRecordKey("");
    if (isSameSearch) {
      void refetch();
      return;
    }
    setSearchParams(nextParams);
  };

  const moveToPage = (page: number) => {
    if (!searchParams || page < 1 || page > totalPages) {
      return;
    }

    setSelectedRecordKey("");
    setSearchParams({ ...searchParams, page: String(page) });
  };

  const handleCopyHeading = () => {
    const selectedDetail = selectedDetailResponse?.data;
    if (
      !referenceTag ||
      !selectedDetail ||
      !isValidAcType(selectedDetail.acType)
    ) {
      return;
    }

    const copiedFields: AuthorityReferenceField[] = create5XXReferenceFields(
      selectedDetail.acType,
      selectedDetail.record,
      relationCode,
      referenceTag,
    ).map((field) => ({
      tag: field.tag,
      ind1: field.indicator1,
      ind2: field.indicator2,
      subfields: field.subfields,
    }));
    const existingKeys = new Set(referenceFields.map(getReferenceFieldKey));
    const uniqueCopiedFields = copiedFields.filter((field) => {
      const key = getReferenceFieldKey(field);
      if (existingKeys.has(key)) {
        return false;
      }
      existingKeys.add(key);
      return true;
    });

    if (uniqueCopiedFields.length > 0) {
      setTemporaryReferenceFields((fields) => [
        ...fields,
        ...uniqueCopiedFields,
      ]);
    }
  };

  const handleReset = () => {
    setSearchKeyword("");
    setSearchParams(undefined);
    setSearchAuthorityType(undefined);
    setSelectedRecordKey("");
    setFontSize(defaultFontSize);
    setRelationCode("");
    setTemporaryReferenceFields([]);
  };

  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-secondary text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          전거통제
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isControlledDetailLoading && (
          <p className="mb-0">통제할 전거의 상세 정보를 불러오는 중입니다.</p>
        )}
        {!isControlledDetailLoading && isControlledDetailError && (
          <p className="mb-0 text-danger" role="alert">
            통제할 전거의 상세 정보를 불러오지 못했습니다.
          </p>
        )}
        {controlledDetail && controlledAuthorityType && referenceTag && (
          <div className="row g-3">
            <div className="col-lg-5">
              <form className="input-group mb-3" onSubmit={handleSearch}>
                <label className="visually-hidden" htmlFor="ctrlAuthorityType">
                  전거유형
                </label>
                <select
                  className="form-select flex-grow-0 w-auto"
                  id="ctrlAuthorityType"
                  value={activeSearchAuthorityType}
                  onChange={(event) => {
                    setSearchAuthorityType(
                      event.target.value as AuthoritySearchType,
                    );
                    setSelectedRecordKey("");
                  }}
                >
                  {Object.entries(authorityTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <span className="input-group-text fw-bold" aria-hidden="true">
                  검색어
                </span>
                <label className="visually-hidden" htmlFor="ctrlSearch">
                  검색어
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ctrlSearch"
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isSearchFetching}
                >
                  찾기
                </button>
              </form>

              <table className="authority-reference-search-table position-relative table table-bordered table-sm text-center align-middle mb-3">
                <caption className="visually-hidden">
                  전거 검색 결과 목록
                </caption>
                <colgroup>
                  <col className="authority-reference-search-no" />
                  <col className="authority-reference-search-select" />
                  <col className="authority-reference-search-type" />
                  <col className="authority-reference-search-control-no" />
                  <col />
                </colgroup>
                <thead className="table-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">선택</th>
                    <th scope="col">전거유형</th>
                    <th scope="col">전거제어번호</th>
                    <th scope="col">채택표목</th>
                  </tr>
                </thead>
                <tbody>
                  {!searchParams && (
                    <tr>
                      <td colSpan={5} className="py-4 text-secondary">
                        검색어를 입력한 후 찾기를 눌러 주세요.
                      </td>
                    </tr>
                  )}
                  {searchParams && isSearchFetching && records.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-secondary">
                        검색 중입니다.
                      </td>
                    </tr>
                  )}
                  {searchParams && isSearchError && (
                    <tr>
                      <td colSpan={5} className="py-4 text-danger">
                        전거 검색 결과를 불러오지 못했습니다.
                      </td>
                    </tr>
                  )}
                  {searchParams &&
                    !isSearchFetching &&
                    !isSearchError &&
                    records.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-secondary">
                          검색 결과가 없습니다.
                        </td>
                      </tr>
                    )}
                  {records.map((record, index) => {
                    const inputId = `ctrl-refSelect-${record.recKey}`;
                    const headingName = record.headingName ?? "";
                    const isSelected = selectedRecordKey === record.recKey;

                    return (
                      <tr key={record.recKey}>
                        <td>
                          {(currentPage - 1) * (searchResult?.display ?? 10) +
                            index +
                            1}
                        </td>
                        <td>
                          <label className="visually-hidden" htmlFor={inputId}>
                            {headingName || record.acControlNo} 선택
                          </label>
                          <input
                            type="radio"
                            id={inputId}
                            name="controlRefSelect"
                            checked={isSelected}
                            onChange={() => setSelectedRecordKey(record.recKey)}
                          />
                        </td>
                        <td>
                          <OverflowTooltip
                            text={authorityTypeLabels[record.acType]}
                          >
                            {authorityTypeLabels[record.acType]}
                          </OverflowTooltip>
                        </td>
                        <td>
                          <OverflowTooltip text={record.acControlNo}>
                            {record.acControlNo}
                          </OverflowTooltip>
                        </td>
                        <td
                          className={`text-start${
                            isSelected ? " text-primary fw-bold" : ""
                          }`}
                        >
                          <OverflowTooltip text={headingName}>
                            {headingName}
                          </OverflowTooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="d-flex justify-content-center align-items-center gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  type="button"
                  aria-label="첫 페이지"
                  disabled={
                    !searchParams || isSearchFetching || currentPage <= 1
                  }
                  onClick={() => moveToPage(1)}
                >
                  <i
                    className="bi bi-chevron-double-left"
                    aria-hidden="true"
                  ></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  type="button"
                  aria-label="이전 페이지"
                  disabled={
                    !searchParams || isSearchFetching || currentPage <= 1
                  }
                  onClick={() => moveToPage(currentPage - 1)}
                >
                  <i className="bi bi-chevron-left" aria-hidden="true"></i>
                </button>
                <span className="border rounded px-3 py-1">
                  {currentPage}/{totalPages}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  type="button"
                  aria-label="다음 페이지"
                  disabled={
                    !searchParams ||
                    isSearchFetching ||
                    currentPage >= totalPages
                  }
                  onClick={() => moveToPage(currentPage + 1)}
                >
                  <i className="bi bi-chevron-right" aria-hidden="true"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  type="button"
                  aria-label="마지막 페이지"
                  disabled={
                    !searchParams ||
                    isSearchFetching ||
                    currentPage >= totalPages
                  }
                  onClick={() => moveToPage(totalPages)}
                >
                  <i
                    className="bi bi-chevron-double-right"
                    aria-hidden="true"
                  ></i>
                </button>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                <span className="fw-bold" aria-hidden="true">
                  글자크기
                </span>
                <MarcFontSizeSelect
                  id="ctrlFontSize"
                  aria-label="전거통제 상세 글자크기"
                  className="form-select-sm w-auto"
                  value={fontSize}
                  onChange={setFontSize}
                />
                <HanjaToHangulModalButton
                  record={selectedDetailResponse?.data.record}
                />
              </div>
              <MarcRecordPreview
                detail={selectedDetailResponse?.data}
                fontSize={`${fontSize}px`}
                className="bg-light mb-2"
                message={selectedDetailMessage}
              />
              <div className="d-flex justify-content-between align-items-center bg-light p-2 border mb-2">
                <div className="d-flex align-items-center flex-wrap gap-2">
                  {(
                    [
                      ["", "적용안함"],
                      ["a", "이전(a)"],
                      ["b", "이후(b)"],
                      ["g", "상위(g)"],
                      ["h", "하위(h)"],
                    ] as const
                  ).map(([value, label]) => {
                    const inputId = `ctrlRelation-${value || "none"}`;

                    return (
                      <div
                        className="form-check form-check-inline mb-0"
                        key={value}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="controlRelationCode"
                          id={inputId}
                          checked={relationCode === value}
                          onChange={() => setRelationCode(value)}
                        />
                        <label className="form-check-label" htmlFor={inputId}>
                          {label}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="btn btn-success btn-sm"
                  type="button"
                  disabled={
                    !selectedRecordKey ||
                    isSelectedDetailFetching ||
                    isSelectedDetailError
                  }
                  onClick={handleCopyHeading}
                >
                  채택표목 복사
                </button>
              </div>
              <table className="table table-bordered table-sm text-center align-middle mb-2">
                <caption className="visually-hidden">5XX 필드 목록</caption>
                <thead className="table-light">
                  <tr>
                    <th scope="col">no</th>
                    <th scope="col">선택</th>
                    <th scope="col">Tag</th>
                    <th scope="col">SB</th>
                    <th scope="col">내용</th>
                  </tr>
                </thead>
                <tbody>
                  {referenceFields.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-3 text-secondary">
                        현재 적용된 {referenceTag} 필드가 없습니다.
                      </td>
                    </tr>
                  )}
                  {referenceFields.map((field, index) => {
                    const inputId = `ctrl-5xxRow-${index}`;
                    const description = getReferenceFieldDescription(field);
                    const isTemporary = index >= existingReferenceFields.length;

                    return (
                      <tr
                        key={`${getReferenceFieldKey(field)}-${index}`}
                        className={isTemporary ? "table-success" : undefined}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <label className="visually-hidden" htmlFor={inputId}>
                            {field.tag} {description} 선택
                          </label>
                          <input
                            type="checkbox"
                            id={inputId}
                            disabled
                            title="삭제 API 연동 예정"
                          />
                        </td>
                        <td className="fw-bold text-primary">{field.tag}</td>
                        <td className="font-monospace">
                          {`${field.ind1}${field.ind2}`.replaceAll(" ", "\\")}
                        </td>
                        <td className="text-start">
                          {field.subfields.map((subfield, subfieldIndex) => (
                            <span
                              key={`${subfield.code}-${subfieldIndex}`}
                              className="me-1"
                            >
                              <span className="marc-sf">${subfield.code}</span>
                              {subfield.value}
                            </span>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="text-end">
                <button
                  className="btn btn-sm btn-outline-danger"
                  type="button"
                  disabled
                  title="삭제 API 연동 예정"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant="secondary" onClick={handleReset}>
          화면 초기화
        </Button>
        <div>
          <Button
            className="px-4 fw-bold"
            variant="primary"
            disabled
            title="전거통제 저장 API 연동 예정"
          >
            확인
          </Button>{" "}
          <Button className="px-4 fw-bold" variant="secondary" onClick={onHide}>
            닫기
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
}
