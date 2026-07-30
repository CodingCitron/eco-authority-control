import { useState } from "react";

import { SearchPageProvider } from "@/components/search-page/search-page-provider";
import SideNavigation from "@/components/layouts/side-navigation";

import SearchResult from "@/components/search-page/search-result";
import AuthorityMergeModal, {
  AuthorityMergeButton,
} from "@/components/search-page/authority-merge-modal";

export default function SearchPage() {
  const [mergeModalIsOpen, setMergeModalIsOpen] = useState(false);

  return (
    <SearchPageProvider>
      <div className="row">
        <SideNavigation />
        <main
          id="main-content"
          className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-4 pb-5 min-vh-100"
        >
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h1 className="h2 fw-bold">전거관리 기본화면</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="bi bi-printer me-1" aria-hidden="true"></i>
                  출력
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalExport"
                >
                  <i className="bi bi-download me-1" aria-hidden="true"></i>
                  일괄반출
                </button>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <form className="row g-2 align-items-center">
                <div className="col-auto">
                  <label
                    className="form-label mb-0 fw-bold text-nowrap"
                    htmlFor="searchType"
                  >
                    전거유형
                  </label>
                </div>
                <div className="col-auto">
                  <select
                    className="form-select form-select-sm"
                    id="searchType"
                  >
                    <option>전체</option>
                    <option selected>개인명</option>
                    <option>단체명</option>
                    <option>지리명</option>
                    <option>주제명</option>
                  </select>
                </div>
                <div className="col-auto">
                  <label
                    className="form-label mb-0 fw-bold ms-3 text-nowrap"
                    htmlFor="searchArea"
                  >
                    전거지역
                  </label>
                </div>
                <div className="col-auto">
                  <select
                    className="form-select form-select-sm"
                    id="searchArea"
                  >
                    <option>전체</option>
                    <option>한국</option>
                    <option>동양</option>
                    <option>서양</option>
                  </select>
                </div>
                <div className="col-auto">
                  <label
                    className="form-label mb-0 fw-bold ms-3 text-nowrap"
                    htmlFor="searchCtrl"
                  >
                    전거제어번호
                  </label>
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="searchCtrl"
                    placeholder="검색어 입력"
                  />
                </div>
                <div className="col-auto d-flex align-items-center gap-2">
                  <label
                    className="form-label mb-0 fw-bold ms-3 text-nowrap"
                    htmlFor="searchHeading"
                  >
                    전거조회표목
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="searchHeading"
                    placeholder="검색어 입력"
                  />
                  <label className="visually-hidden" htmlFor="searchTrunc">
                    조회표목 절단방식
                  </label>
                  <select
                    className="form-select form-select-sm"
                    id="searchTrunc"
                  >
                    <option>우절단</option>
                  </select>
                </div>
                <div className="col-auto ms-auto d-flex gap-1">
                  <button type="button" className="btn btn-primary btn-sm">
                    찾기
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm">
                    화면초기화
                  </button>
                </div>
              </form>
            </div>

            <div className="card-body">
              <div className="mb-2 d-flex justify-content-between">
                <div>
                  <span className="text-muted">
                    <label htmlFor="checkAll" className="visually-hidden">
                      전체 선택
                    </label>
                    <input type="checkbox" id="checkAll" /> 전체{" "}
                    <strong id="listTotalCount">0</strong>건 / 선택{" "}
                    <strong className="text-primary" id="listCheckedCount">
                      0
                    </strong>
                    건
                  </span>{" "}
                  <AuthorityMergeButton
                    onOpen={() => setMergeModalIsOpen(true)}
                  />{" "}
                  <button type="button" className="btn btn-outline-dark btn-sm">
                    <i
                      className="bi bi-layout-split me-1"
                      aria-hidden="true"
                    ></i>
                    전거분리
                  </button>{" "}
                  <button type="button" className="btn btn-outline-info btn-sm">
                    <i
                      className="bi bi-clock-history me-1"
                      aria-hidden="true"
                    ></i>
                    변경이력보기
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#modalControl"
                  >
                    <i className="bi bi-link-45deg me-1" aria-hidden="true"></i>
                    전거통제
                  </button>{" "}
                  <button className="btn btn-light-danger btn-sm">
                    <i className="bi bi-trash me-1" aria-hidden="true"></i>
                    삭제
                  </button>
                </div>
                <div>
                  <button className="btn btn-light-success btn-sm">
                    <i
                      className="bi bi-plus-circle me-1"
                      aria-hidden="true"
                    ></i>
                    입력
                  </button>
                </div>
              </div>
              <SearchResult />
            </div>
          </div>
        </main>
      </div>
      <AuthorityMergeModal
        show={mergeModalIsOpen}
        onHide={() => setMergeModalIsOpen(false)}
      />
    </SearchPageProvider>
  );
}
