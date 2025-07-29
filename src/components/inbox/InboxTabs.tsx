import { useState } from "react";

import clsx from "clsx";

import { INBOX_TABS } from "@/constants/inbox";
import { Tab } from "@/types/inbox";

const InboxTabs = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>("전체");

  return (
    <div className="mt-6 w-full relative">
      {/* 회색 전체 밑줄 */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-10 z-0" />

      {/* 탭 버튼 */}
      <div className="relative flex gap-4 z-10">
        {INBOX_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={clsx(
              "relative px-6 py-4 text-body1 transition-colors duration-200 cursor-pointer",
              selectedTab === tab
                ? "text-main text-body1-b"
                : "text-gray-60 hover:text-gray-80"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 선택한 탭 밑줄 */}
      <div
        className={clsx(
          "absolute bottom-0 h-[2px] bg-main transition-all duration-300 ease-in-out z-10",
          selectedTab === "전체"
            ? "w-[80px] translate-x-0"
            : "w-[95px] translate-x-[96px]"
        )}
      />
    </div>
  );
};

export default InboxTabs;
