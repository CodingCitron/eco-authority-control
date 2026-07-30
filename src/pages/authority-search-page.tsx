import { Link } from "react-router";

import { SearchPageProvider } from "@/components/authority-search-page/authority-search-page-provider";
import AuthoritySearchForm from "@/components/authority-search-page/authority-search-form";
import AuthoritySelectionControl from "@/components/authority-search-page/authority-selection-control";
import AuthoritySearchResult from "@/components/authority-search-page/authority-search-result";
import { AuthorityMergeButton } from "@/components/authority-search-page/authority-merge-modal";
import { AuthoritySplitButton } from "@/components/authority-search-page/authority-split-modal";
import { AuthorityHistoryButton } from "@/components/authority-search-page/authority-history-modal";
import { AuthorityControlButton } from "@/components/authority-search-page/authority-control-modal";
import { AuthorityDeleteButton } from "@/components/authority-search-page/authority-delete-modal";

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
                <AuthoritySelectionControl /> <AuthorityMergeButton />{" "}
                <AuthoritySplitButton /> <AuthorityHistoryButton />{" "}
                <AuthorityControlButton /> <AuthorityDeleteButton />
              </div>
              <div>
                <Link to="/" className="btn btn-light-success btn-sm">
                  <i className="bi bi-plus-circle me-1" aria-hidden="true"></i>
                  입력
                </Link>
              </div>
            </div>
            <AuthoritySearchResult />
          </div>
        </div>
      </main>
    </SearchPageProvider>
  );
}
