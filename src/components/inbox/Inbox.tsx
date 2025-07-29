import { useRef, useState } from "react";

import clsx from "clsx";

import InboxList from "@/components/inbox/InboxList";
import InboxTabs from "@/components/inbox/InboxTabs";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Tab } from "@/types/inbox";
import {
  MOCK_ARCHIVED_INBOX_RESPONSE,
  MOCK_INBOX_RESPONSE,
} from "@/mocks/inboxMock";

type Props = {
  isSidebarOpen: boolean;
  isOpen: boolean;
  onClose: () => void;
  triggerRefs: React.RefObject<HTMLLIElement | null>[];
};

const Inbox = ({ isSidebarOpen, isOpen, onClose, triggerRefs }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick([ref, ...triggerRefs], onClose);

  const [selectedTab, setSelectedTab] = useState<Tab>("전체");

  const allInquiries = MOCK_INBOX_RESPONSE.teams.flatMap(
    team => team.inquiries
  );
  const archivedInquiries = MOCK_ARCHIVED_INBOX_RESPONSE.teams.flatMap(
    team => team.inquiries
  );

  return (
    <aside
      ref={ref}
      className={clsx(
        "fixed top-16 px-9 pt-[52px] w-[560px] h-[calc(100vh-64px)] bg-white border-x border-gray-20 z-100 transition-all duration-300",
        isSidebarOpen ? "left-[320px]" : "left-[100px]",
        isOpen
          ? "opacity-100 translate-x-0 duration-300 pointer-events-auto delay-100"
          : "opacity-0 -translate-x-2 duration-200 pointer-events-none delay-0"
      )}
    >
      <div className="flex items-center gap-6">
        <p className="text-heading1 text-gray-80">수신함</p>
        <div className="px-4 py-1 bg-main rounded-[30px] h-[30px] flex justify-center items-center">
          <span className=" text-white text-body1">4</span>
        </div>
      </div>
      <InboxTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />
      {selectedTab === "보관함" ? (
        <InboxList inquiries={archivedInquiries} tab="보관함" /> // TODO: API 명세 나오면 거기에 맞게 바꿔야 함
      ) : (
        <InboxList inquiries={allInquiries} tab="전체" />
      )}
    </aside>
  );
};

export default Inbox;
