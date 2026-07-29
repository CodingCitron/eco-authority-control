import { Link } from "react-router";

export default function SideNavigation() {
  return (
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
              <i className="bi bi-search me-2" aria-hidden="true"></i>통합 전거
              검색
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
              <i className="bi bi-bar-chart-line me-2" aria-hidden="true"></i>
              구축현황
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
