import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { Outlet, useLocation } from "react-router-dom";

import ProfileModal from "@/components/common/ProfileModal";
import AddMemberSidebar from "@/components/home/AddMemberSidebar";
import Inbox from "@/components/inbox/Inbox";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/sidebar/SideBar";

import { useProfileStore } from "@/store/useProfileStore";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddMemberSidebarOpen, setIsAddMemberSidebarOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const inboxLargeRef = useRef<HTMLLIElement>(null);
  const inboxSmallRef = useRef<HTMLLIElement>(null);
  const [isGroupSelectorOpen, setIsGroupSelectorOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  // 라우트 변경 시 스크롤 맨 위로
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  // 프로필 모달 상태
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalOffset, setProfileModalOffset] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const { profile } = useProfileStore();

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

  // 프로필 호버 핸들러
  const handleProfileHoverChange = (
    isHovered: boolean,
    offset?: { left: number; top: number }
  ) => {
    if (isHovered) {
      setIsProfileModalOpen(true);
      setProfileModalOffset(offset || null);
    } else {
      // ProfileModal 내부에서 호버 상태를 관리하므로 즉시 닫지 않음
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearchActiveChange={handleSearchActiveChange}
        onProfileHoverChange={handleProfileHoverChange}
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
          ref={mainRef}
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

      {/* 프로필 모달 */}
      {isProfileModalOpen && profileModalOffset && profile && (
        <div
          className="fixed z-2000 transition-all duration-200 ease-in-out"
          style={{
            left: profileModalOffset.left,
            top: profileModalOffset.top,
          }}
        >
          <ProfileModal
            id={profile.id}
            isOpen={true}
            onClose={() => {
              setIsProfileModalOpen(false);
              setProfileModalOffset(null);
            }}
            isOwnProfile={true}
          />
        </div>
      )}
    </div>
  );
};

export default Layout;
