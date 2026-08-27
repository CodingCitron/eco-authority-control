import { Outlet } from "react-router";

import Header from "@/components/layouts/header";
import SideNavigation from "@/components/layouts/side-navigation";

export default function MainLayout() {
  return (
    <div className="bg-light">
      <Header />
      <div className="container-fluid">
        <div className="row">
          <SideNavigation />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
