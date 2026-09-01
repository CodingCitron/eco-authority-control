import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";

import {
  authorityTypeLabels,
  isValidAcType,
  type AuthoritySearchType,
} from "@/types/authority.types";
import PrintButton from "@/components/ui/print-button";
import { useCurrentAuthorityStatistics } from "@/hooks/use-authority-statistics";

type FormValues = {
  acType: AuthoritySearchType | "all"; // 전거유형
  regDateFrom: string; // 등록일자 시작
  regDateTo: string; // 등록일자 종료
  modDateFrom: string; // 수정일자 시작
  modDateTo: string; // 수정일자 종료
  editor: string; // 수정자
};

const emptyFormValues: FormValues = {
  acType: "all",
  regDateFrom: "",
  regDateTo: "",
  modDateFrom: "",
  modDateTo: "",
  editor: "",
};

const countFormatter = new Intl.NumberFormat("ko-KR");

function formatStatisticsCount(count: number) {
  return `${countFormatter.format(count)} 건`;
}

function getFormValues(searchParams: URLSearchParams): FormValues {
  const acType = searchParams.get("acType");

  return {
    acType: acType === "all" || isValidAcType(acType) ? acType : "all",
    regDateFrom: searchParams.get("regDateFrom") || "",
    regDateTo: searchParams.get("regDateTo") || "",
    modDateFrom: searchParams.get("modDateFrom") || "",
    modDateTo: searchParams.get("modDateTo") || "",
    editor: searchParams.get("editor") || "",
  };
}

function getSearchScope(searchParams: URLSearchParams) {
  return JSON.stringify(getFormValues(searchParams));
}

export default function AuthorityBuildStatusPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const contentRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: getFormValues(searchParams),
  });

  const {
    data: statisticsResponse,
    isLoading,
    isError,
    isSearched,
    refetch,
  } = useCurrentAuthorityStatistics();

  useEffect(() => {
    const values = getFormValues(new URLSearchParams(searchParamsKey));
    Object.entries(values).forEach(([name, value]) => {
      setValue(name as keyof FormValues, value);
    });
  }, [searchParamsKey, setValue]);

  const onSubmit = (values: FormValues) => {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    const isSameSearch =
      isSearched && getSearchScope(searchParams) === getSearchScope(params);

    setSearchParams(params);

    if (isSameSearch) {
      void refetch();
    }
  };

  const onReset = () => {
    Object.entries(emptyFormValues).forEach(([name, value]) => {
      setValue(name as keyof FormValues, value);
    });
    setSearchParams(new URLSearchParams());
  };

  const statistics = isSearched ? statisticsResponse?.data : undefined;

  return (
    <main
      id="main-content"
      className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-4 pb-5 min-vh-100"
    >
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2 fw-bold">구축현황</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-printer me-1" aria-hidden="true"></i>출력
            </button>
            <PrintButton contentRef={contentRef} />
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="row g-2 align-items-center"
          >
            <div className="col-auto">
              <label
                className="form-label mb-0 fw-bold text-nowrap"
                htmlFor="bs-authType"
              >
                전거유형
              </label>
            </div>
            <div className="col-auto">
              <select
                className="form-select form-select-sm"
                {...register("acType")}
              >
                <option value="all">전체</option>
                {Object.entries(authorityTypeLabels).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-auto d-flex align-items-center gap-1">
              <label
                className="form-label mb-0 fw-bold ms-3 text-nowrap"
                htmlFor="bs-regDateFrom"
              >
                등록일자
              </label>
              <input
                type="date"
                id="bs-regDateFrom"
                className="form-control form-control-sm"
                aria-label="등록일자 시작"
                {...register("regDateFrom")}
              />
              <span aria-hidden="true">~</span>
              <input
                type="date"
                className="form-control form-control-sm"
                aria-label="등록일자 종료"
                {...register("regDateTo")}
              />
            </div>
            <div className="col-auto d-flex align-items-center gap-1">
              <label
                className="form-label mb-0 fw-bold ms-3 text-nowrap"
                htmlFor="bs-modDateFrom"
              >
                수정일자
              </label>
              <input
                type="date"
                id="bs-modDateFrom"
                className="form-control form-control-sm"
                aria-label="수정일자 시작"
                {...register("modDateFrom")}
              />
              <span aria-hidden="true">~</span>
              <input
                type="date"
                className="form-control form-control-sm"
                aria-label="수정일자 종료"
                {...register("modDateTo")}
              />
            </div>
            <div className="col-auto d-flex align-items-center gap-1">
              <label
                className="form-label mb-0 fw-bold ms-3 text-nowrap"
                htmlFor="bs-editor"
              >
                수정자
              </label>
              <input
                type="text"
                id="bs-editor"
                className="form-control form-control-sm"
                placeholder="수정자 입력"
                {...register("editor")}
              />
            </div>
            <div className="col-auto ms-auto">
              <button type="submit" className="btn btn-primary btn-sm">
                조회
              </button>{" "}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onReset}
              >
                초기화
              </button>
            </div>
          </form>
        </div>

        <div className="card-body" ref={contentRef}>
          <table className="table table-bordered text-center align-middle">
            <caption className="visually-hidden">구축현황표</caption>
            <thead className="table-light">
              <tr>
                <th scope="col">전거유형</th>
                <th scope="col">구축 건수</th>
              </tr>
            </thead>
            <tbody>
              {!isSearched ? (
                <tr>
                  <td colSpan={2} className="text-muted" role="status">
                    조회 조건을 설정한 후 조회해 주세요.
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan={2} className="text-muted" role="status">
                    구축현황을 불러오는 중입니다.
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={2} className="text-danger" role="alert">
                    구축현황을 불러오지 못했습니다. 다시 시도해주세요.
                  </td>
                </tr>
              ) : statistics ? (
                <>
                  {statistics.byType.map((item) => (
                    <tr key={item.acType}>
                      <td>{item.acTypeName}</td>
                      <td>{formatStatisticsCount(item.count)}</td>
                    </tr>
                  ))}
                  <tr className="table-light">
                    <td className="fw-bold">전체</td>
                    <td className="fw-bold">
                      {formatStatisticsCount(statistics.total)}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={2} className="text-muted" role="status">
                    조회된 구축현황이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
