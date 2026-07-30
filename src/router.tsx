import { createBrowserRouter } from "react-router";

import RootLayout from "@/components/layouts/root-layout";

import GlobalErrorPage from "@/pages/global-error-page";

import AuthoritySearchPage from "@/pages/authority-search-page";
import AuthorityPersonalFormPage from "@/pages/authority-personal-form-page";

const router = createBrowserRouter([
  {
    errorElement: <GlobalErrorPage />,
    element: <RootLayout />,
    children: [
      {
        // 통합 전거 검색
        path: "/",
        element: <AuthoritySearchPage />,
      },
      {
        // 개인명 등록
        path: "/personal/new",
        element: <AuthorityPersonalFormPage />,
      },
      {
        // 개인명 수정
        path: "/personal/edit/:controlNumber",
        element: <AuthorityPersonalFormPage />,
      },
    ],
  },
]);

export default router;
