import { createBrowserRouter } from "react-router";

import MainLayout from "@/components/layouts/main-layout";

import GlobalErrorPage from "@/pages/global-error-page";

import SignInPage from "@/pages/sign-in-page";
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
    children: [
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        element: <MainLayout />,
        children: [
          {
            // 통합 전거 검색
            path: "",
            element: <AuthoritySearchPage />,
          },
          {
            // 개인명 등록
            path: "personal/new",
            element: <AuthorityPersonalFormPage mode="create" />,
          },
          {
            // 개인명 수정
            path: "personal/edit",
            element: <AuthorityPersonalFormPage mode="edit" />,
          },
          {
            // 단체명 등록
            path: "corporation/new",
            element: <AuthorityCorporationFormPage mode="create" />,
          },
          {
            // 단체명 수정
            path: "corporation/edit",
            element: <AuthorityCorporationFormPage mode="edit" />,
          },
          {
            // 지리명 등록
            path: "geography/new",
            element: <AuthorityGeographyFormPage mode="create" />,
          },
          {
            // 지리명 수정
            path: "geography/edit",
            element: <AuthorityGeographyFormPage mode="edit" />,
          },
          {
            // 주제명 등록
            path: "subject/new",
            element: <AuthoritySubjectFormPage mode="create" />,
          },
          {
            // 주제명 수정
            path: "subject/edit",
            element: <AuthoritySubjectFormPage mode="edit" />,
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
    ],
  },
  {
    // 404 페이지
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
