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

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <AddMemberSidebar
        isOpen={isAddMemberSidebarOpen}
        onClose={() => setIsAddMemberSidebarOpen(false)}
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
