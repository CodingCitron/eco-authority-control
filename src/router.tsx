import { createBrowserRouter } from "react-router";

import RootLayout from "./components/layouts/RootLayout";
import Home from "./pages/HomePage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

export default router;
