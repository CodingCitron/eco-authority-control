import { createBrowserRouter } from "react-router";

import RootLayout from "@/components/layouts/root-layout";

import GlobalErrorPage from "@/pages/global-error-page";

import AuthoritySearchPage from "@/pages/authority-search-page";
import AuthorityPersonalFormPage from "@/pages/authority-personal-form-page";
import AuthorityCorporationFormPage from "@/pages/authority-corporation-form-page";
import AuthorityToolsPage from "./pages/authority-tools-page";
import AuthorityBuildStatusPage from "./pages/authority-build-status-page";

const router = createBrowserRouter([
  {
    errorElement: <GlobalErrorPage />,
    element: <RootLayout />,
    children: [
      {
        // 통합 전거 검색
        path: "",
        element: <AuthoritySearchPage />,
      },
      {
        // 개인명 등록
        path: "personal/new",
        element: <AuthorityPersonalFormPage />,
      },
      {
        // 개인명 수정
        path: "personal/edit/:controlNumber",
        element: <AuthorityPersonalFormPage />,
      },
      {
        // 단체명 등록
        path: "corporation/new",
        element: <AuthorityCorporationFormPage />,
      },
      {
        // 단체명 수정
        path: "corporation/edit/:controlNumber",
        element: <AuthorityCorporationFormPage />,
      },
      {
        // 전거 반입 관리
        path: "tools",
        element: <AuthorityToolsPage />,
      },
      {
        // 구축현황
        path: "build-status",
        element: <AuthorityBuildStatusPage />,
      },
    ],
  },
]);

export default router;
