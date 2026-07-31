import { createBrowserRouter } from "react-router";

import RootLayout from "@/components/layouts/root-layout";

import GlobalErrorPage from "@/pages/global-error-page";

import AuthoritySearchPage from "@/pages/authority-search-page";
import AuthorityPersonalFormPage from "@/pages/authority-personal-form-page";
import AuthorityCorporationFormPage from "@/pages/authority-corporation-form-page";
import AuthorityGeographyFormPage from "@/pages/authority-geography-form-page";
import AuthoritySubjectFormPage from "@/pages/authority-subject-form-page";
import AuthorityToolsPage from "@/pages/authority-tools-page";
import AuthorityBuildStatusPage from "@/pages/authority-build-status-page";
import NotFoundPage from "@/pages/not-found-page";

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
        path: "personal/:controlNumber/edit",
        element: <AuthorityPersonalFormPage />,
      },
      {
        // 단체명 등록
        path: "corporation/new",
        element: <AuthorityCorporationFormPage />,
      },
      {
        // 단체명 수정
        path: "corporation/:controlNumber/edit",
        element: <AuthorityCorporationFormPage />,
      },
      {
        // 지리명 등록
        path: "geography/new",
        element: <AuthorityGeographyFormPage />,
      },
      {
        // 지리명 수정
        path: "geography/:controlNumber/edit",
        element: <AuthorityGeographyFormPage />,
      },
      {
        // 주제명 등록
        path: "subject/new",
        element: <AuthoritySubjectFormPage />,
      },
      {
        // 주제명 수정
        path: "subject/:controlNumber/edit",
        element: <AuthoritySubjectFormPage />,
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
  {
    // 404 페이지
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
