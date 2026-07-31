export default function AuthorityBuildStatusPage() {
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
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <form className="row g-2 align-items-center">
            <div className="col-auto">
              <label
                className="form-label mb-0 fw-bold text-nowrap"
                htmlFor="bs-authType"
              >
                전거유형
              </label>
            </div>
            <div className="col-auto">
              <select id="bs-authType" className="form-select form-select-sm">
                <option>전체</option>
                <option>개인명</option>
                <option>단체명</option>
                <option>지리명</option>
                <option>주제명</option>
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
              />
              <span aria-hidden="true">~</span>
              <input
                type="date"
                className="form-control form-control-sm"
                aria-label="등록일자 종료"
              />
            </div>
            <div className="col-auto d-flex align-items-center gap-1">
              <label
                className="form-label mb-0 fw-bold ms-3 text-nowrap"
                htmlFor="bs-modDateFrom"
              >
                수정일자(삭제일자)
              </label>
              <input
                type="date"
                id="bs-modDateFrom"
                className="form-control form-control-sm"
                aria-label="수정일자 시작"
              />
              <span aria-hidden="true">~</span>
              <input
                type="date"
                className="form-control form-control-sm"
                aria-label="수정일자 종료"
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
              />
            </div>
            <div className="col-auto ms-auto">
              <button type="button" className="btn btn-primary btn-sm">
                조회
              </button>
              <button type="button" className="btn btn-secondary btn-sm">
                초기화
              </button>
            </div>
          </form>
        </div>

        <div className="card-body">
          <table className="table table-bordered text-center align-middle">
            <caption className="visually-hidden">구축현황표</caption>
            <thead className="table-light">
              <tr>
                <th scope="col">전거유형</th>
                <th scope="col">구축 건수</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>개인명</td>
                <td>25,000 건</td>
              </tr>
              <tr>
                <td>단체명</td>
                <td>32,000 건</td>
              </tr>
              <tr>
                <td>지리명</td>
                <td>1,200 건</td>
              </tr>
              <tr>
                <td>주제명</td>
                <td>1,500 건</td>
              </tr>
              <tr className="table-light">
                <td className="fw-bold">전체</td>
                <td className="fw-bold">59,700 건</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
