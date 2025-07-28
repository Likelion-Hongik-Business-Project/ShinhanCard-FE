import { useState } from "react";

import { Outlet } from "react-router-dom";

import AddMemberSidebar from "@/components/home/AddMemberSidebar";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/sidebar/SideBar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddMemberSidebarOpen, setIsAddMemberSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <AddMemberSidebar
        isOpen={isAddMemberSidebarOpen}
        onClose={() => setIsAddMemberSidebarOpen(false)}
      />
      <div className="flex flex-1">
        <SideBar isOpen={isSidebarOpen} />
        <main
          className={`bg-gray-10 flex flex-1 justify-start overflow-auto pt-16 transition-all duration-300 ${
            isSidebarOpen
              ? "ml-[320px] 1600:justify-center"
              : "ml-[100px] 1380:justify-center"
          }`}
        >
          <div className="w-full py-20 min-w-[1280px] max-w-[1580px] px-20">
            <Outlet
              context={{
                openAddMemberSidebar: () => setIsAddMemberSidebarOpen(true),
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
