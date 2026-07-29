import { Outlet } from "react-router";
import Header from "@/components/layouts/header";

export default function RootLayout() {
  return (
    <div className="bg-light">
      <Header />

      <div className="container-fluid">
        <Outlet />
      </div>
    </div>
  );
}
