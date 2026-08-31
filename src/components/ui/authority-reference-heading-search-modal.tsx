import { useState, type SubmitEvent } from "react";
import { Button, Modal } from "react-bootstrap";

import type { AuthoritySearchQueryParams } from "@/api/authority-search";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import { useAuthoritySearch } from "@/hooks/use-authority-search";
import type { AuthorityDataField } from "@/types/authority-detail.types";
import { authorityTypeLabels } from "@/types/authority.types";
import type { MarcDataField } from "@/types/marc-editor.types";

import {
  copyAuthorityReferenceField,
  type AuthorityReferenceRelationCode,
} from "./authority-reference-heading.mapper";
import BaseModal from "./base-modal";
import MarcFontSizeSelect, { defaultFontSize } from "./marc-font-size-select";
import MarcRecordPreview from "./record-preview";

const referenceSearchDefaultParams: AuthoritySearchQueryParams = {
  acType: "1",
  searchType: "CONTAINS",
  page: "1",
  display: "10",
};

function getReferenceFieldDescription(field: AuthorityDataField) {
  return field.subfields
    .filter(({ code }) => code === "a" || code === "b")
    .map(({ value }) => value)
    .join(" ");
}

interface AuthorityReferenceHeadingSearchProps {
  onCopy: (fields: MarcDataField[]) => void;
}

export function AuthorityReferenceHeadingSearchButton({
  onCopy,
}: AuthorityReferenceHeadingSearchProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    setModalIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary w-100"
        onClick={handleClick}
      >
        참조표목조회(5XX) 추가
      </button>
      <AuthorityReferenceHeadingSearchModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
        onCopy={onCopy}
      />
    </>
  );
}

export function AuthorityReferenceHeadingSearchModal({
  show,
  onHide,
  onCopy,
}: AuthorityReferenceHeadingSearchProps & {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <BaseModal show={show} onHide={onHide}>
      <AuthorityReferenceHeadingSearchModalBody
        onHide={onHide}
        onCopy={onCopy}
      />
    </BaseModal>
  );
}

export function AuthorityReferenceHeadingSearchModalBody({
  onHide,
  onCopy,
}: AuthorityReferenceHeadingSearchProps & {
  onHide: () => void;
}) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams, setSearchParams] =
    useState<AuthoritySearchQueryParams>();
  const [selectedRecordKey, setSelectedRecordKey] = useState("");
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [relationCode, setRelationCode] =
    useState<AuthorityReferenceRelationCode>("");
  const [selectedReferenceIndexes, setSelectedReferenceIndexes] = useState(
    new Set<number>(),
  );

  const {
    data: searchResponse,
    isFetching,
    isError,
    refetch,
  } = useAuthoritySearch(searchParams ?? referenceSearchDefaultParams, {
    enabled: searchParams !== undefined,
  });

  const {
    data: detailResponse,
    isFetching: isDetailFetching,
    isError: isDetailError,
  } = useAuthorityDetail(selectedRecordKey, {
    enabled: Boolean(selectedRecordKey),
  });

  const searchResult = searchResponse?.data;
  const records = searchResult?.items ?? [];
  const currentPage = searchResult?.page ?? Number(searchParams?.page ?? 1);
  const totalPages = Math.max(searchResult?.totalPages ?? 1, 1);
  const referenceFields =
    detailResponse?.data.record.dataFields.filter(
      (field) => field.tag === "510",
    ) ?? [];
  const detailMessage = !selectedRecordKey
    ? "검색 결과에서 전거를 선택해 주세요."
    : isDetailError
      ? "선택한 전거의 상세 정보를 불러오지 못했습니다."
      : isDetailFetching
        ? "선택한 전거의 상세 정보를 불러오는 중입니다."
        : "선택한 전거의 상세 정보가 없습니다.";

  const handleSearch = (event: SubmitEvent) => {
    event.preventDefault();

    const normalizedKeyword = searchKeyword.trim();
    const nextParams: AuthoritySearchQueryParams = {
      ...referenceSearchDefaultParams,
      ...(normalizedKeyword && { searchKeyword: normalizedKeyword }),
    };
    const isSameSearch =
      searchParams?.searchKeyword === nextParams.searchKeyword &&
      searchParams?.page === nextParams.page;

    setSelectedRecordKey("");
    setSelectedReferenceIndexes(new Set());
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
    setSelectedReferenceIndexes(new Set());
    setSearchParams({ ...searchParams, page: String(page) });
  };

  const handleCopyToReferenceField = () => {
    const copiedFields = referenceFields.flatMap((field, index) => {
      if (!selectedReferenceIndexes.has(index)) {
        return [];
      }

      const copiedField = copyAuthorityReferenceField(field, relationCode);
      return copiedField ? [copiedField] : [];
    });
    if (copiedFields.length === 0) {
      return;
    }

    onCopy(copiedFields);
    setSelectedReferenceIndexes(new Set());
  };

  const toggleReferenceField = (index: number) => {
    setSelectedReferenceIndexes((indexes) => {
      const nextIndexes = new Set(indexes);
      if (nextIndexes.has(index)) {
        nextIndexes.delete(index);
      } else {
        nextIndexes.add(index);
      }
      return nextIndexes;
    });
  };

  const handleReset = () => {
    setSearchKeyword("");
    setSearchParams(undefined);
    setSelectedRecordKey("");
    setFontSize(defaultFontSize);
    setRelationCode("");
    setSelectedReferenceIndexes(new Set());
  };

  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-secondary text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          참조표목조회(5XX) 추가
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3">
          <div className="col-lg-5">
            <form className="input-group mb-3" onSubmit={handleSearch}>
              <span className="input-group-text fw-bold" aria-hidden="true">
                검색어
              </span>
              <label className="visually-hidden" htmlFor="c-5xxSearch">
                검색어
              </label>
              <input
                type="text"
                className="form-control"
                id="c-5xxSearch"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isFetching}
              >
                찾기
              </button>
            </form>
            <div className="border-bottom mb-3">
              <table className="table table-bordered table-sm text-center align-middle mb-0">
                <caption className="visually-hidden">
                  전거 검색 결과 목록
                </caption>
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
                  {searchParams && isFetching && records.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-secondary">
                        검색 중입니다.
                      </td>
                    </tr>
                  )}
                  {searchParams && isError && (
                    <tr>
                      <td colSpan={5} className="py-4 text-danger">
                        전거 검색 결과를 불러오지 못했습니다.
                      </td>
                    </tr>
                  )}
                  {searchParams &&
                    !isFetching &&
                    !isError &&
                    records.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-secondary">
                          검색 결과가 없습니다.
                        </td>
                      </tr>
                    )}
                  {records.map((record, index) => {
                    const inputId = `c-refSelect-${record.recKey}`;
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
                            name="refSelect"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedRecordKey(record.recKey);
                              setSelectedReferenceIndexes(new Set());
                            }}
                          />
                        </td>
                        <td>{authorityTypeLabels[record.acType]}</td>
                        <td>{record.acControlNo}</td>
                        <td
                          className={`text-start${
                            isSelected ? " text-primary fw-bold" : ""
                          }`}
                        >
                          {headingName}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-label="첫 페이지"
                disabled={!searchParams || isFetching || currentPage <= 1}
                onClick={() => moveToPage(1)}
              >
                <i className="bi bi-chevron-double-left" aria-hidden="true"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-label="이전 페이지"
                disabled={!searchParams || isFetching || currentPage <= 1}
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
                  !searchParams || isFetching || currentPage >= totalPages
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
                  !searchParams || isFetching || currentPage >= totalPages
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
              <label className="visually-hidden" htmlFor="c-5xxFontSize">
                글자크기
              </label>
              <span className="fw-bold" aria-hidden="true">
                글자크기
              </span>
              <MarcFontSizeSelect
                id="c-5xxFontSize"
                aria-label="참조표목 상세 글자크기"
                className="form-select-sm w-auto"
                value={fontSize}
                onChange={setFontSize}
              />
              <button className="btn btn-sm btn-outline-dark">
                한자 -&gt; 한글
              </button>
            </div>
            <MarcRecordPreview
              detail={detailResponse?.data}
              fontSize={`${fontSize}px`}
              className="form-control bg-light mb-2"
              message={detailMessage}
            />
            <div className="d-flex justify-content-between align-items-center bg-light p-2 border mb-2">
              <div className="d-flex gap-2">
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="btnradio"
                    id="btnradio0"
                    checked={relationCode === ""}
                    onChange={() => setRelationCode("")}
                  />
                  <label className="form-check-label" htmlFor="btnradio0">
                    적용안함
                  </label>
                </div>
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="btnradio"
                    id="btnradio1"
                    checked={relationCode === "a"}
                    onChange={() => setRelationCode("a")}
                  />
                  <label className="form-check-label" htmlFor="btnradio1">
                    이전 (a)
                  </label>
                </div>
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="btnradio"
                    id="btnradio2"
                    checked={relationCode === "b"}
                    onChange={() => setRelationCode("b")}
                  />
                  <label className="form-check-label" htmlFor="btnradio2">
                    이후(b)
                  </label>
                </div>
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="btnradio"
                    id="btnradio3"
                    checked={relationCode === "g"}
                    onChange={() => setRelationCode("g")}
                  />
                  <label className="form-check-label" htmlFor="btnradio3">
                    상위 (g)
                  </label>
                </div>
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="btnradio"
                    id="btnradio4"
                    checked={relationCode === "h"}
                    onChange={() => setRelationCode("h")}
                  />
                  <label className="form-check-label" htmlFor="btnradio4">
                    하위(h)
                  </label>
                </div>
              </div>
              <button
                className="btn btn-success btn-sm"
                type="button"
                disabled={
                  selectedReferenceIndexes.size === 0 ||
                  isDetailFetching ||
                  isDetailError
                }
                onClick={handleCopyToReferenceField}
              >
                5XX로 복사
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
                {!selectedRecordKey && (
                  <tr>
                    <td colSpan={5} className="py-3 text-secondary">
                      검색 결과에서 전거를 선택해 주세요.
                    </td>
                  </tr>
                )}
                {selectedRecordKey && isDetailFetching && (
                  <tr>
                    <td colSpan={5} className="py-3 text-secondary">
                      510 필드를 불러오는 중입니다.
                    </td>
                  </tr>
                )}
                {selectedRecordKey && isDetailError && (
                  <tr>
                    <td colSpan={5} className="py-3 text-danger">
                      510 필드를 불러오지 못했습니다.
                    </td>
                  </tr>
                )}
                {selectedRecordKey &&
                  detailResponse &&
                  referenceFields.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-3 text-secondary">
                        선택한 전거에 510 필드가 없습니다.
                      </td>
                    </tr>
                  )}
                {referenceFields.map((field, index) => {
                  const inputId = `c-5xxRow-${index}`;
                  const description = getReferenceFieldDescription(field);

                  return (
                    <tr
                      key={`${field.tag}-${index}-${JSON.stringify(field.subfields)}`}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <label className="visually-hidden" htmlFor={inputId}>
                          {field.tag} {description} 선택
                        </label>
                        <input
                          type="checkbox"
                          id={inputId}
                          checked={selectedReferenceIndexes.has(index)}
                          onChange={() => toggleReferenceField(index)}
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
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant="secondary" onClick={handleReset}>
          화면 초기화
        </Button>
        <div>
          <Button className="px-4 fw-bold" variant="primary" onClick={onHide}>
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
