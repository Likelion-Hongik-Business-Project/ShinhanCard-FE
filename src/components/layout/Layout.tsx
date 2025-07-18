import { useState } from "react";

import { Outlet } from "react-router-dom";

import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <SideBar isOpen={isSidebarOpen} />
        <main
          className={`bg-gray-10 flex flex-1 justify-center overflow-auto pt-16 transition-all duration-300 ${
            isSidebarOpen ? "ml-[320px] px-[30px]" : "ml-[100px] px-[140px]"
          }`}
        >
          <div className="w-full py-20 min-w-[900px] 1840:max-w-[1420px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
