import { createBrowserRouter } from "react-router";

import RootLayout from "@/components/layouts/root-layout";

import GlobalErrorPage from "@/pages/global-error-page";
import SearchPage from "@/pages/authority-search-page";

const router = createBrowserRouter([
  {
    errorElement: <GlobalErrorPage />,
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <SearchPage />,
      },
    ],
  },
]);

export default router;
