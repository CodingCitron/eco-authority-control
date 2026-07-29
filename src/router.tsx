import { createBrowserRouter } from "react-router";

import RootLayout from "./components/layouts/root-layout";

import SearchPage from "./pages/search-page";

const router = createBrowserRouter([
  {
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
