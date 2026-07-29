import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="container-fluid">
      <div className="row">
        <nav
          id="sidebarMenu"
          className="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse shadow-sm"
          aria-label="주요 메뉴"
        >
          <div className="position-sticky pt-3 sidebar-sticky">
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
              <span>전거 검색 및 목록</span>
            </h6>
            <ul className="nav flex-column mb-3">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  <i className="bi bi-search me-2" aria-hidden="true"></i>통합
                  전거 검색
                </Link>
              </li>
            </ul>
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
              <span>전거 레코드 관리</span>
            </h6>
            <ul className="nav flex-column mb-3">
              <li className="nav-item">
                <a className="nav-link " href="form_personal.html">
                  <i className="bi bi-person me-2" aria-hidden="true"></i>개인명
                  등록/수정
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="form_corp.html">
                  <i className="bi bi-building me-2" aria-hidden="true"></i>
                  단체명 등록/수정
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="form_geo.html">
                  <i className="bi bi-geo-alt me-2" aria-hidden="true"></i>
                  지리명 등록/수정
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="form_subject.html">
                  <i className="bi bi-book me-2" aria-hidden="true"></i>주제명
                  등록/수정
                </a>
              </li>
            </ul>
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
              <span>전거 반입관리</span>
            </h6>
            <ul className="nav flex-column mb-3">
              <li className="nav-item">
                <a className="nav-link" href="tools.html">
                  <i className="bi bi-upload me-2" aria-hidden="true"></i>전거
                  반입관리
                </a>
              </li>
            </ul>
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
              <span>구축현황 보기</span>
            </h6>
            <ul className="nav flex-column mb-3">
              <li className="nav-item">
                <a className="nav-link" href="build_status.html">
                  <i
                    className="bi bi-bar-chart-line me-2"
                    aria-hidden="true"
                  ></i>
                  구축현황
                </a>
              </li>
            </ul>
          </div>
        </nav>

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
                  <i className="bi bi-printer me-1" aria-hidden="true"></i>출력
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
                <div className="d-flex align-items-center gap-1">
                  <span className="text-muted d-flex align-items-center gap-1">
                    <label htmlFor="checkAll" className="visually-hidden">
                      전체 선택
                    </label>
                    <input type="checkbox" id="checkAll" />
                    전체 <strong id="listTotalCount">0</strong>건 / 선택{" "}
                    <strong className="text-primary" id="listCheckedCount">
                      0
                    </strong>
                    건
                  </span>
                  <button type="button" className="btn btn-outline-dark btn-sm">
                    <i className="bi bi-intersect me-1" aria-hidden="true"></i>
                    전거통합
                  </button>
                  <button type="button" className="btn btn-outline-dark btn-sm">
                    <i
                      className="bi bi-layout-split me-1"
                      aria-hidden="true"
                    ></i>
                    전거분리
                  </button>
                  <button type="button" className="btn btn-outline-info btn-sm">
                    <i
                      className="bi bi-clock-history me-1"
                      aria-hidden="true"
                    ></i>
                    변경이력보기
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#modalControl"
                  >
                    <i className="bi bi-link-45deg me-1" aria-hidden="true"></i>
                    전거통제
                  </button>
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

              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="tab-personal"
                    data-bs-toggle="tab"
                    data-bs-target="#personal"
                    aria-controls="personal"
                  >
                    개인명
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="tab-corp"
                    data-bs-toggle="tab"
                    data-bs-target="#corp"
                    aria-controls="corp"
                  >
                    단체명
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="tab-geo"
                    data-bs-toggle="tab"
                    data-bs-target="#geo"
                    aria-controls="geo"
                  >
                    지리명
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="tab-subject"
                    data-bs-toggle="tab"
                    data-bs-target="#subject"
                    aria-controls="subject"
                  >
                    주제명
                  </button>
                </li>
              </ul>
              <div
                className="tab-content border-start border-end border-bottom p-3 bg-white"
                id="myTabContent"
              >
                <div
                  className="tab-pane fade show active"
                  id="personal"
                  role="tabpanel"
                  tabIndex={0}
                  aria-labelledby="tab-personal"
                >
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover text-center align-middle text-nowrap table-sm">
                      <caption className="visually-hidden">
                        개인명 전거 목록
                      </caption>
                      <thead className="table-light">
                        <tr>
                          <th scope="col">no</th>
                          <th scope="col" className="no-sort">
                            선택
                          </th>
                          <th scope="col">전거유형</th>
                          <th scope="col">전거지역</th>
                          <th scope="col">채택표목</th>
                          <th scope="col">한자명</th>
                          <th scope="col">생몰년</th>
                          <th scope="col">분야</th>
                          <th scope="col">정보원</th>
                          <th scope="col">제어번호</th>
                          <th scope="col">입력자</th>
                          <th scope="col">수정자</th>
                          <th scope="col" className="no-sort">
                            관리
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          data-ctrl="KAC202600001"
                          data-type="개인명"
                          data-heading="김소월"
                          data-source="김소월 시집(670$a)"
                        >
                          <td>1</td>
                          <td>
                            <label htmlFor="check1" className="visually-hidden">
                              김소월 선택
                            </label>
                            <input type="checkbox" id="check1" />
                          </td>
                          <td>개인명</td>
                          <td>한국</td>
                          <td className="text-start fw-bold text-primary">
                            김소월
                          </td>
                          <td>金素月</td>
                          <td>1902-1934</td>
                          <td>한국 시;문학(372$a)</td>
                          <td>김소월 시집(670$a)</td>
                          <td>KAC202600001</td>
                          <td>홍길동</td>
                          <td>김영희</td>
                          <td>
                            <a
                              href="form_personal.html"
                              className="btn btn-sm btn-light-warning py-0"
                            >
                              수정
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-light-danger py-0"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                        <tr
                          data-ctrl="KAC202600002"
                          data-type="개인명"
                          data-heading="김소월"
                          data-source="김소월 시집(670$a)"
                        >
                          <td>2</td>
                          <td>
                            <label htmlFor="check2" className="visually-hidden">
                              김소월 선택
                            </label>
                            <input type="checkbox" id="check2" />
                          </td>
                          <td>개인명</td>
                          <td>한국</td>
                          <td className="text-start fw-bold text-primary">
                            김소월
                          </td>
                          <td>金素月</td>
                          <td>1902-1934</td>
                          <td>한국 시;문학(372$a)</td>
                          <td>김소월 시집(670$a)</td>
                          <td>KAC202600001</td>
                          <td>홍길동</td>
                          <td>김영희</td>
                          <td>
                            <a
                              href="form_personal.html"
                              className="btn btn-sm btn-light-warning py-0"
                            >
                              수정
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-light-danger py-0"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="corp"
                  role="tabpanel"
                  tabIndex={0}
                  aria-labelledby="tab-corp"
                >
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover text-center align-middle text-nowrap table-sm">
                      <caption className="visually-hidden">
                        단체명 전거 목록
                      </caption>
                      <thead className="table-light">
                        <tr>
                          <th scope="col">no</th>
                          <th scope="col" className="no-sort">
                            선택
                          </th>
                          <th scope="col">전거유형</th>
                          <th scope="col">전거지역</th>
                          <th scope="col">채택표목</th>
                          <th scope="col">단체유형</th>
                          <th scope="col">설립일/폐쇄일</th>
                          <th scope="col">분야</th>
                          <th scope="col">정보원</th>
                          <th scope="col">제어번호</th>
                          <th scope="col">입력자</th>
                          <th scope="col">수정자</th>
                          <th scope="col" className="no-sort">
                            관리
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          data-ctrl="KAB201206266"
                          data-type="단체명"
                          data-heading="헌법재판소.헌법재판연구원"
                          data-source="헌법 연구 자료(670 $a)"
                        >
                          <td>1</td>
                          <td>
                            <label
                              className="visually-hidden"
                              htmlFor="check-corp1"
                            >
                              헌법재판소.헌법재판연구원 선택
                            </label>
                            <input type="checkbox" id="check-corp1" />
                          </td>
                          <td>단체명</td>
                          <td>한국</td>
                          <td className="text-start fw-bold text-primary">
                            헌법재판소.헌법재판연구원
                          </td>
                          <td>학술단체(연구소.연구단체)</td>
                          <td>20110101-</td>
                          <td>법학(法學)(372 $a)</td>
                          <td>헌법 연구 자료(670 $a)</td>
                          <td>KAB201206266</td>
                          <td>홍길동</td>
                          <td>김영희</td>
                          <td>
                            <a
                              href="form_corp.html"
                              className="btn btn-sm btn-light-warning py-0"
                            >
                              수정
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-light-danger py-0"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="geo"
                  role="tabpanel"
                  tabIndex={0}
                  aria-labelledby="tab-geo"
                >
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover text-center align-middle text-nowrap table-sm">
                      <caption className="visually-hidden">
                        지리명 전거 목록
                      </caption>
                      <thead className="table-light">
                        <tr>
                          <th scope="col">no</th>
                          <th scope="col" className="no-sort">
                            선택
                          </th>
                          <th scope="col">전거유형</th>
                          <th scope="col">전거지역</th>
                          <th scope="col">채택표목</th>
                          <th scope="col">정보원</th>
                          <th scope="col">제어번호</th>
                          <th scope="col">입력자</th>
                          <th scope="col">수정자</th>
                          <th scope="col" className="no-sort">
                            관리
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          data-ctrl="KAG201206266"
                          data-type="지리명"
                          data-heading="울릉도[鬱陵島]"
                          data-source="울릉도문화로 아름다고...(670 $a)"
                        >
                          <td>1</td>
                          <td>
                            <label
                              className="visually-hidden"
                              htmlFor="check-geo1"
                            >
                              울릉도[鬱陵島] 선택
                            </label>
                            <input type="checkbox" id="check-geo1" />
                          </td>
                          <td>지리명</td>
                          <td>한국</td>
                          <td className="text-start fw-bold text-primary">
                            울릉도[鬱陵島]
                          </td>
                          <td>울릉도문화로 아름다고...(670 $a)</td>
                          <td>KAG201206266</td>
                          <td>홍길동</td>
                          <td>김영희</td>
                          <td>
                            <a
                              href="form_geo.html"
                              className="btn btn-sm btn-light-warning py-0"
                            >
                              수정
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-light-danger py-0"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="subject"
                  role="tabpanel"
                  tabIndex={0}
                  aria-labelledby="tab-subject"
                >
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover text-center align-middle text-nowrap table-sm">
                      <caption className="visually-hidden">
                        주제명 전거 목록
                      </caption>
                      <thead className="table-light">
                        <tr>
                          <th scope="col">no</th>
                          <th scope="col" className="no-sort">
                            선택
                          </th>
                          <th scope="col">전거유형</th>
                          <th scope="col">전거지역</th>
                          <th scope="col">채택표목</th>
                          <th scope="col">정보원</th>
                          <th scope="col">일반주기</th>
                          <th scope="col">제어번호</th>
                          <th scope="col">입력자</th>
                          <th scope="col">수정자</th>
                          <th scope="col" className="no-sort">
                            관리
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          data-ctrl="KSH201400013"
                          data-type="주제명"
                          data-heading="부작위[不作爲]"
                          data-source="법률용어사전(670 $a)"
                        >
                          <td>1</td>
                          <td>
                            <label
                              className="visually-hidden"
                              htmlFor="check-subj1"
                            >
                              부작위[不作爲] 선택
                            </label>
                            <input type="checkbox" id="check-subj1" />
                          </td>
                          <td>주제명</td>
                          <td>한국</td>
                          <td className="text-start fw-bold text-primary">
                            부작위(不作爲)
                          </td>
                          <td>법률용어사전(670 $a)</td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "200px" }}
                          >
                            이 표목은 법률상 의무가 있는 자가...
                          </td>
                          <td>KSH201400013</td>
                          <td>홍길동</td>
                          <td>김영희</td>
                          <td>
                            <a
                              href="form_subject.html"
                              className="btn btn-sm btn-light-warning py-0"
                            >
                              수정
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-light-danger py-0"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                        <tr
                          data-ctrl="KSH201300011"
                          data-type="주제명"
                          data-heading="부작위"
                          data-source=""
                        >
                          <td>2</td>
                          <td>
                            <label
                              className="visually-hidden"
                              htmlFor="check-subj2"
                            >
                              부작위 선택
                            </label>
                            <input type="checkbox" id="check-subj2" />
                          </td>
                          <td>주제명</td>
                          <td>한국</td>
                          <td className="text-start fw-bold text-primary">
                            부작위
                          </td>
                          <td></td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "200px" }}
                          ></td>
                          <td>KSH201300011</td>
                          <td>홍길동</td>
                          <td>김영희</td>
                          <td>
                            <a
                              href="form_subject.html"
                              className="btn btn-sm btn-light-warning py-0"
                            >
                              수정
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-light-danger py-0"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
