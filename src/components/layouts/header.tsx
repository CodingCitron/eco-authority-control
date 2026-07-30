import { Link } from "react-router";
import { css } from "styled-system/css";

import logo from "@/assets/images/logo.png";

const imgCss = css({ height: "40px" });

export default function Header() {
  return (
    <>
      <Link to="/" className="visually-hidden-focusable skip-link">
        본문 바로가기
      </Link>
      <header className="navbar navbar-dark sticky-top bg-primary flex-md-nowrap p-0 shadow">
        <Link
          to="/"
          className="navbar-brand col-md-3 col-lg-2 me-0 p-3 fs-6 fw-bold d-flex align-items-center gap-2"
        >
          <img src={logo} alt="KORMARC" className={imgCss} />
        </Link>
        <div className="navbar-nav w-100 d-flex flex-row align-items-center justify-content-end px-3">
          <div className="nav-item text-nowrap">
            <span className="nav-link text-white px-3">
              <i className="bi bi-person me-2" aria-hidden="true"></i>
              관리자(홍길동)
            </span>
          </div>
          <div className="nav-item text-nowrap">
            <a className="btn btn-sm btn-outline-light" href="#">
              로그아웃
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
