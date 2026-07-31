export default function AuthorityToolsPage() {
  return (
    <main
      id="main-content"
      className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-4 pb-5 min-vh-100"
    >
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2 fw-bold">전거 반입관리</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-printer me-1" aria-hidden="true"></i>출력
            </button>
          </div>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div className="d-flex gap-2 flex-wrap">
              <input
                type="file"
                className="form-control w-auto"
                aria-label="반입 파일 선택"
              />
              <button className="btn btn-outline-dark btn-sm">파일읽기</button>
              <button className="btn btn-outline-dark btn-sm">
                복본조사/검증
              </button>
              <button className="btn btn-outline-dark btn-sm">자동선정</button>
              <button className="btn btn-primary btn-sm">반입처리</button>
            </div>
          </div>
          <div className="bg-light rounded box-group border p-3 mb-3">
            <span className="me-4">
              <strong>전체:</strong> 1건
            </span>{" "}
            <span className="me-4 text-success">
              <strong>정상:</strong> 0건
            </span>{" "}
            <span className="text-danger">
              <strong>비정상:</strong> 1건
            </span>
          </div>
          <table className="table table-bordered text-center table-sm align-middle">
            <caption className="visually-hidden">전거반입 목록</caption>
            <thead className="table-light">
              <tr>
                <th className="no-sort" scope="col">
                  선택
                </th>
                <th scope="col">전거유형</th>
                <th scope="col">채택표목</th>
                <th scope="col">생몰년</th>
                <th scope="col">복본개수</th>
                <th scope="col">문제점</th>
                <th className="no-sort" scope="col">
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" checked aria-label="김소월 선택" />
                </td>
                <td>개인명</td>
                <td className="text-start fw-bold">김소월</td>
                <td>1902-1934</td>
                <td>0</td>
                <td className="text-danger fw-bold">제1지시기호 오류</td>
                <td>
                  <a
                    href="form_import_edit.html"
                    className="btn btn-sm btn-light-warning py-0"
                  >
                    수정
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
