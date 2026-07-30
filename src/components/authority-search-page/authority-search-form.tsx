import { authorityTypeLabels } from "@/api/authority-search";

export default function AuthoritySearchForm() {
  return (
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
          <select className="form-select form-select-sm" id="searchType">
            <option>전체</option>
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
          <select className="form-select form-select-sm" id="searchArea">
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
          <select className="form-select form-select-sm" id="searchTrunc">
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
  );
}
