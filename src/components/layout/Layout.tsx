import { useRef, useState } from "react";

import clsx from "clsx";
import { Outlet } from "react-router-dom";

import AddMemberSidebar from "@/components/home/AddMemberSidebar";
import Inbox from "@/components/inbox/Inbox";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/sidebar/SideBar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddMemberSidebarOpen, setIsAddMemberSidebarOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const inboxLargeRef = useRef<HTMLLIElement>(null);
  const inboxSmallRef = useRef<HTMLLIElement>(null);
  const [isGroupSelectorOpen, setIsGroupSelectorOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // AddMemberSidebar에 전달할 팀 정보 상태
  const [sidebarTeamInfo, setSidebarTeamInfo] = useState<{
    teamName: string;
    teamId: number;
  }>({
    teamName: "",
    teamId: 0,
  });

  const handleSearchActiveChange = (isActive: boolean) => {
    if (isActive && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  // AddMemberSidebar를 열 때 팀 정보를 받아서 설정하는 함수
  const openAddMemberSidebar = (teamName: string, teamId: number) => {
    setSidebarTeamInfo({ teamName, teamId });
    setIsAddMemberSidebarOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearchActiveChange={handleSearchActiveChange}
      />
      <AddMemberSidebar
        isOpen={isAddMemberSidebarOpen}
        onClose={() => setIsAddMemberSidebarOpen(false)}
        teamName={sidebarTeamInfo.teamName}
        teamId={sidebarTeamInfo.teamId}
      />
      <div className="flex flex-1">
        <SideBar
          isOpen={isSidebarOpen}
          toggleInbox={() => setIsInboxOpen(prev => !prev)}
          isInboxOpen={isInboxOpen}
          inboxLargeRef={inboxLargeRef}
          inboxSmallRef={inboxSmallRef}
          isGroupSelectorOpen={isGroupSelectorOpen}
          setIsGroupSelectorOpen={setIsGroupSelectorOpen}
          selectedGroupId={selectedGroupId}
          setSelectedGroupId={setSelectedGroupId}
        />
        {isInboxOpen && (
          <Inbox
            isOpen={isInboxOpen}
            isSidebarOpen={isSidebarOpen}
            onClose={() => setIsInboxOpen(false)}
            triggerRefs={[inboxLargeRef, inboxSmallRef]}
          />
        )}
        <main
          className={clsx(
            "bg-gray-10 flex flex-1 justify-start overflow-auto pt-16 transition-all duration-300",
            isSidebarOpen
              ? isInboxOpen
                ? "ml-[830px]"
                : "ml-[320px] 1600:justify-center"
              : isInboxOpen
                ? "ml-[610px]"
                : "ml-[100px] 1380:justify-center"
          )}
        >
          <div className="w-full py-20 min-w-[1280px] max-w-[1580px] px-20">
            <Outlet
              context={{
                openAddMemberSidebar,
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
