import { Outlet } from "react-router-dom";

import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
