import { useEffect, useTransition } from "react";
import { useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";

import {
  parseAuthoritySearchType,
  type AuthoritySearchType,
  authorityTypeLabels,
} from "@/types/authority.types";

import queryClient from "@/lib/query-client";
import {
  authoritySearchQueryKeys,
  getAuthoritySearchState,
} from "@/hooks/use-authority-search";
import { useAuthoritySettings } from "@/hooks/use-authority-settings";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";

function normalizeRegionCode(value: string | null) {
  return !value || value === "all" ? "0" : value;
}

function getSearchScope(params: URLSearchParams) {
  return JSON.stringify({
    searchKeyword: params.get("searchKeyword") || undefined,
    searchType: params.get("searchType") || undefined,
    acRegionCode: normalizeRegionCode(params.get("acRegionCode")),
    acType: params.get("acType") || "0",
    acControlNo: params.get("acControlNo") || undefined,
    page: params.get("page") || "1",
    display: params.get("display") || "20",
  });
}

interface AuthoritySearchFormValues {
  acType: AuthoritySearchType;
  acRegionCode: string;
  acControlNo: string;
  searchKeyword: string;
  searchType: string;
}

const emptyFormValues: AuthoritySearchFormValues = {
  acType: "0",
  acRegionCode: "0",
  acControlNo: "",
  searchKeyword: "",
  searchType: "CONTAINS",
};

function getFormValues(
  searchParams: URLSearchParams,
): AuthoritySearchFormValues {
  return {
    acType: parseAuthoritySearchType(searchParams.get("acType")),
    acRegionCode: normalizeRegionCode(searchParams.get("acRegionCode")),
    acControlNo: searchParams.get("acControlNo") || "",
    searchKeyword: searchParams.get("searchKeyword") || "",
    searchType: searchParams.get("searchType") || emptyFormValues.searchType,
  };
}

export default function AuthoritySearchForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const [isPending, startTransition] = useTransition();

  const {
    data: settingsResponse,
    isLoading: isSettingsLoading,
    isError: isSettingsError,
  } = useAuthoritySettings();

  const settings = settingsResponse?.data;

  const { clearSelectedRecordKeys } = useSearchPage();
  const { control, register, handleSubmit, setValue } =
    useForm<AuthoritySearchFormValues>({
      defaultValues: getFormValues(searchParams),
    });

  useEffect(() => {
    const values = getFormValues(new URLSearchParams(searchParamsKey));
    Object.entries(values).forEach(([name, value]) => {
      setValue(name as keyof AuthoritySearchFormValues, value);
    });
  }, [searchParamsKey, setValue]);

  const onSubmit = (values: AuthoritySearchFormValues) => {
    const nextParams = new URLSearchParams();
    const trimmedControlNumber = values.acControlNo.trim();
    const trimmedHeading = values.searchKeyword.trim();
    const trimmedSearchType = values.searchType.trim();

    nextParams.set("acType", values.acType);
    nextParams.set("acRegionCode", values.acRegionCode);

    if (trimmedControlNumber)
      nextParams.set("acControlNo", trimmedControlNumber);

    if (trimmedHeading) nextParams.set("searchKeyword", trimmedHeading);
    if (trimmedSearchType) {
      nextParams.set("searchType", trimmedSearchType);
    }

    const hasSearchChanged =
      getSearchScope(searchParams) !== getSearchScope(nextParams);

    if (hasSearchChanged) {
      clearSelectedRecordKeys();
    } else if (getAuthoritySearchState(searchParams).isSearched) {
      void queryClient.refetchQueries({
        queryKey: authoritySearchQueryKeys.all,
        type: "active",
      });

      clearSelectedRecordKeys();
    }

    startTransition(() => {
      setSearchParams(nextParams);
    });
  };

  const handleReset = () => {
    Object.entries(emptyFormValues).forEach(([name, value]) => {
      setValue(name as keyof AuthoritySearchFormValues, value);
    });

    clearSelectedRecordKeys();

    void queryClient.cancelQueries({
      queryKey: authoritySearchQueryKeys.all,
    });

    // URL을 즉시 비워 쿼리의 enabled 조건을 먼저 해제한다.
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="card-header bg-white py-3">
      <form
        className="row g-2 align-items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
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
            {...register("acType")}
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
          <Controller
            name="acRegionCode"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="form-select form-select-sm"
                id="searchArea"
                disabled={isSettingsLoading || isSettingsError}
              >
                {!settings && field.value !== "0" && (
                  <option value={field.value}>
                    {isSettingsError ? "설정 조회 실패" : "설정 불러오는 중"}
                  </option>
                )}
                {Object.entries(settings?.REGION_CODE ?? {}).map(
                  ([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            )}
          />
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
            {...register("acControlNo")}
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
            {...register("searchKeyword")}
          />
          <label className="visually-hidden" htmlFor="searchTrunc">
            조회표목 절단방식
          </label>
          <Controller
            name="searchType"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="form-select form-select-sm"
                id="searchTrunc"
                disabled={isSettingsLoading || isSettingsError}
              >
                {settings ? (
                  Object.entries(settings.TRUNCATION_TYPE).map(
                    ([type, label]) => (
                      <option key={type} value={type}>
                        {label}
                      </option>
                    ),
                  )
                ) : (
                  <option value={field.value}>
                    {isSettingsError ? "설정 조회 실패" : "설정 불러오는 중"}
                  </option>
                )}
              </select>
            )}
          />
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
