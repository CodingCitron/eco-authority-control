import { useState, type SubmitEvent } from "react";
import { Button, Modal } from "react-bootstrap";

import type { AuthoritySearchQueryParams } from "@/api/authority-search";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import { useAuthoritySearch } from "@/hooks/use-authority-search";
import { authorityTypeLabels } from "@/types/authority.types";

import BaseModal from "./base-modal";
import MarcFontSizeSelect, {
  defaultFontSize,
} from "./marc-font-size-select";
import MarcRecordPreview from "./record-preview";

const referenceSearchDefaultParams: AuthoritySearchQueryParams = {
  acType: "1",
  searchType: "CONTAINS",
  page: "1",
  display: "10",
};

export function AuthorityReferenceHeadingSearchButton() {
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
      />
    </>
  );
}

export function AuthorityReferenceHeadingSearchModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <BaseModal show={show} onHide={onHide}>
      <AuthorityReferenceHeadingSearchModalBody onHide={onHide} />
    </BaseModal>
  );
}

export function AuthorityReferenceHeadingSearchModalBody({
  onHide,
}: {
  onHide: () => void;
}) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams, setSearchParams] =
    useState<AuthoritySearchQueryParams>();
  const [selectedRecordKey, setSelectedRecordKey] = useState("");
  const [fontSize, setFontSize] = useState(defaultFontSize);

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
            <table className="table table-bordered table-sm text-center align-middle">
              <caption className="visually-hidden">전거 검색 결과 목록</caption>
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
                          onChange={() => setSelectedRecordKey(record.recKey)}
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
                    defaultChecked
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
                  />
                  <label className="form-check-label" htmlFor="btnradio4">
                    하위(h)
                  </label>
                </div>
              </div>
              <button className="btn btn-success btn-sm">5XX로 복사</button>
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
                <tr>
                  <td>1</td>
                  <td>
                    <label className="visually-hidden" htmlFor="c-5xxRow1">
                      510 한국. 문화관광부 선택
                    </label>
                    <input type="checkbox" id="c-5xxRow1" />
                  </td>
                  <td className="fw-bold text-primary">510</td>
                  <td></td>
                  <td className="text-start">
                    <span className="marc-sf">$w</span>b
                    <span className="marc-sf">$a</span>한국.
                    <span className="marc-sf">$b</span>문화관광부
                    <span className="marc-sf">$0</span>KAB201206266
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <label className="visually-hidden" htmlFor="c-5xxRow2">
                      510 한국. 공보부 선택
                    </label>
                    <input type="checkbox" id="c-5xxRow2" />
                  </td>
                  <td className="fw-bold text-primary">510</td>
                  <td></td>
                  <td className="text-start">
                    <span className="marc-sf">$w</span>a
                    <span className="marc-sf">$a</span>한국.
                    <span className="marc-sf">$b</span>공보부
                    <span className="marc-sf">$0</span>KAB201400005
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-end">
              <button className="btn btn-sm btn-outline-danger">삭제</button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant="secondary">화면 초기화</Button>
        <div>
          <Button className="px-4 fw-bold" variant="primary">
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
