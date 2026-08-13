import { useState, useTransition, useEffect, type SubmitEvent } from "react";
import { useSearchParams } from "react-router";

import {
  parseAuthoritySearchNationality,
  parseAuthoritySearchType,
  type AuthoritySearchNationality,
  type AuthoritySearchType,
  authorityTypeLabels,
  authorityNationalLabels,
} from "@/types/authority-search.types";

import queryClient from "@/lib/query-client";
import { authoritySearchQueryKeys } from "@/hooks/use-authority-search-query";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";

function getSearchScope(params: URLSearchParams) {
  return JSON.stringify({
    searchKeyword: params.get("searchKeyword") ?? "",
    searchType: params.get("acType") ?? "",
    acRegionCode: params.get("acRegionCode") ?? "",
    acControlNo: params.get("acControlNo") ?? "",
    acType: params.get("acType") ?? "0",
    page: params.get("page") ?? "",
    display: params.get("display") ?? "",
  });
}

export default function AuthoritySearchForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { clearSelectedControlNumbers } = useSearchPage();

  const [type, setType] = useState(
    parseAuthoritySearchType(searchParams.get("acType")),
  );
  const [nationality, setNationality] = useState(
    parseAuthoritySearchNationality(searchParams.get("acRegionCode")),
  );
  const [controlNumber, setControlNumber] = useState(
    searchParams.get("acControlNo") || "",
  );
  const [heading, setHeading] = useState(
    searchParams.get("searchKeyword") || "",
  );

  useEffect(() => {
    setType(parseAuthoritySearchType(searchParams.get("acType")));
    setNationality(
      parseAuthoritySearchNationality(searchParams.get("acRegionCode")),
    );
    setControlNumber(searchParams.get("acControlNo") || "");
    setHeading(searchParams.get("searchKeyword") || "");
  }, [searchParams]);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const nextParams = new URLSearchParams();
    const trimmedControlNumber = controlNumber.trim();
    const trimmedHeading = heading.trim();

    if (type) nextParams.set("acType", type);
    if (nationality) nextParams.set("acRegionCode", nationality);

    if (trimmedControlNumber)
      nextParams.set("acControlNo", trimmedControlNumber);

    if (trimmedHeading) nextParams.set("searchKeyword", trimmedHeading);

    nextParams.set("isSearched", "true");

    const hasSearchChanged =
      getSearchScope(searchParams) !== getSearchScope(nextParams);

    if (hasSearchChanged) {
      clearSelectedControlNumbers();
    }
    startTransition(() => {
      setSearchParams(nextParams);
    });
  };

  const handleReset = () => {
    setType("0");
    setNationality("all");
    setControlNumber("");
    setHeading("");

    startTransition(() => {
      setSearchParams(new URLSearchParams());
    });

    queryClient.resetQueries({
      queryKey: authoritySearchQueryKeys.all,
    });
  };

  return (
    <div className="card-header bg-white py-3">
      <form className="row g-2 align-items-center" onSubmit={handleSubmit}>
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
            value={type}
            onChange={(e) => setType(e.target.value as AuthoritySearchType)}
          >
            {Object.entries(authorityTypeLabels).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
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
            value={nationality}
            onChange={(e) =>
              setNationality(e.target.value as AuthoritySearchNationality)
            }
          >
            {Object.entries(authorityNationalLabels).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
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
            value={controlNumber}
            onChange={(e) => setControlNumber(e.target.value)}
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
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
          <label className="visually-hidden" htmlFor="searchTrunc">
            조회표목 절단방식
          </label>
          <select className="form-select form-select-sm" id="searchTrunc">
            <option>우절단</option>
          </select>
        </div>
        <div className="col-auto ms-auto d-flex gap-1">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isPending}
          >
            찾기
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            disabled={isPending}
          >
            화면초기화
          </button>
        </div>
      </form>
    </div>
  );
}
