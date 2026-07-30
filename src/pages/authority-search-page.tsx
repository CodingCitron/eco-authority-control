import { SearchPageProvider } from "@/components/authority-search-page/authority-search-page-provider";
import AuthoritySearchResult from "@/components/authority-search-page/authority-search-result";
import { AuthorityMergeButton } from "@/components/authority-search-page/authority-merge-modal";
import AuthoritySearchForm from "@/components/authority-search-page/authority-search-form";

import PrintButton from "@/components/ui/print-button";
import BulkExportButton from "@/components/ui/bulk-export-button";

export default function SearchPage() {
  return (
    <SearchPageProvider>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-4 pb-5 min-vh-100">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 className="h2 fw-bold">전거관리 기본화면</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group me-2">
              <PrintButton />
              <BulkExportButton />
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <AuthoritySearchForm />

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
                <AuthorityMergeButton />{" "}
                <button type="button" className="btn btn-outline-dark btn-sm">
                  <i className="bi bi-layout-split me-1" aria-hidden="true"></i>
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
                  <i className="bi bi-plus-circle me-1" aria-hidden="true"></i>
                  입력
                </button>
              </div>
            </div>
            <AuthoritySearchResult />
          </div>
        </div>
      </main>
    </SearchPageProvider>
  );
}
