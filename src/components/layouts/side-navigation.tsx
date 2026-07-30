import { Link, useLocation } from "react-router";

import clsx from "clsx";

type NavLinkItem = {
  to: string;
  icon: React.ReactNode;
  label: string;
  match?: string | string[];
};

type NavLinkCategory = {
  id: string;
  label: string;
  items: NavLinkItem[];
};

const navLinkCategories: NavLinkCategory[] = [
  {
    id: "search",
    label: "전거 검색 및 목록",
    items: [
      {
        to: "/",
        icon: <i className="bi bi-search me-2" aria-hidden="true"></i>,
        label: "통합 전거 검색",
        match: "/",
      },
    ],
  },
  {
    id: "management",
    label: "전거 레코드 관리",
    items: [
      {
        to: "/personal/new",
        icon: <i className="bi bi-person me-2" aria-hidden="true"></i>,
        label: "개인명 등록/수정",
        match: "/personal/new",
      },
      {
        to: "/corporation/new",
        icon: <i className="bi bi-building me-2" aria-hidden="true"></i>,
        label: "단체명 등록/수정",
        match: "/corp/new",
      },
      {
        to: "/geography/new",
        icon: <i className="bi bi-geo-alt me-2" aria-hidden="true"></i>,
        label: "지리명 등록/수정",
        match: "/geo/new",
      },
      {
        to: "/subject/new",
        icon: <i className="bi bi-book me-2" aria-hidden="true"></i>,
        label: "주제명 등록/수정",
        match: "/subject/new",
      },
    ],
  },
  {
    id: "import",
    label: "전거 반입관리",
    items: [
      {
        to: "/tools",
        icon: <i className="bi bi-upload me-2" aria-hidden="true"></i>,
        label: "전거 반입관리",
        match: "/tools",
      },
    ],
  },
  {
    id: "build",
    label: "구축현황 보기",
    items: [
      {
        to: "/build-status",
        icon: <i className="bi bi-bar-chart-line me-2" aria-hidden="true"></i>,
        label: "구축현황",
        match: "/build-status",
      },
    ],
  },
];

export default function SideNavigation() {
  const { pathname } = useLocation();

  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse shadow-sm"
      aria-label="주요 메뉴"
    >
      <div className="position-sticky pt-3 sidebar-sticky">
        {navLinkCategories.map((category) => (
          <>
            <h6
              key={category.id}
              className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase"
            >
              <span>{category.label}</span>
            </h6>
            <ul className="nav flex-column mb-3">
              {category.items.map((item) => (
                <li key={item.to} className="nav-item">
                  <Link
                    className={clsx("nav-link", {
                      active: item.match === pathname,
                    })}
                    aria-current="page"
                    to={item.to}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ))}
      </div>
    </nav>
  );
}
