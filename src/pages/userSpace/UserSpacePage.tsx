import { useState } from "react";

import Heart from "@/assets/svgs/common/heart.svg";
import HeartActive from "@/assets/svgs/common/heart-active.svg";
import Upload from "@/assets/svgs/common/upload.svg";
import Pencil from "@/assets/svgs/layout/pencil.svg";
import Profile from "@/assets/svgs/layout/profile.svg";
import Button from "@/components/common/Button";
import { USER_SPACE_TABS } from "@/constants/userSpace";

const UserSpacePage = () => {
  const [isHearted, setIsHearted] = useState(false);
  const [activeTab, setActiveTab] =
    useState<(typeof USER_SPACE_TABS)[number]["key"]>("written");

  const getTabClass = (tabKey: string) =>
    [
      activeTab === tabKey
        ? "bg-state-progress-01 border-2 border-main"
        : "bg-white border border-gray-20",
      "flex flex-col justify-center items-center gap-4 rounded-[13px] px-8 py-6",
      "w-full sm:w-[calc((100%-2rem)/3)] max-w-[463px] h-[160px]",
    ].join(" ");

  return (
    <section
      className="w-full overflow-x-auto"
      style={{
        maxWidth: "1420px",
        paddingLeft: "80px",
        paddingRight: "80px",
        margin: "0 auto",
      }}
    >
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full">
        <div
          className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-full overflow-hidden relative shrink-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(38, 40, 76, 0.2), rgba(38, 40, 76, 0.2)), lightgray",
          }}
        >
          <Profile className="w-full h-full object-cover" />
        </div>

        <div className="pl-4 flex-1 min-w-[180px]">
          <h1 className="text-heading1 text-black whitespace-nowrap">
            @@@님의 스페이스
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-3">
            <span className="text-heading3-sb text-main">Core 개발 2부</span>
            <span className="text-body2 text-gray-60 whitespace-nowrap">
              경영 기획 그룹 &gt; ICT 본부
            </span>
          </div>
        </div>

        <div className="flex gap-4 ml-auto mt-4 sm:mt-0">
          <Button
            type="active"
            className="flex items-center gap-2 whitespace-nowrap px-4 py-3"
          >
            <Pencil className="w-4 h-4 text-white" />
            <span className="text-heading3 text-white">
              @@@님에게 문의 작성
            </span>
          </Button>

          <Button type="heart" onClick={() => setIsHearted(prev => !prev)}>
            {isHearted ? (
              <HeartActive className="w-[24px] h-[24px] aspect-square" />
            ) : (
              <Heart className="w-[24px] h-[24px] aspect-square" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 pt-12 w-full overflow-x-auto scrollbar-hide">
        {USER_SPACE_TABS.map(
          ({
            key,
            label,
            activeIcon: ActiveIcon,
            inactiveIcon: InactiveIcon,
          }) => (
            <Button
              key={key}
              type="none"
              className={getTabClass(key)}
              onClick={() => setActiveTab(key)}
            >
              {activeTab === key ? (
                <ActiveIcon className="w-10 h-10" />
              ) : (
                <InactiveIcon className="w-10 h-10" />
              )}
              <span
                className={`text-lg font-bold font-pretendard ${
                  activeTab === key ? "text-main-dark" : "text-gray-50"
                }`}
              >
                {label}
              </span>
            </Button>
          )
        )}
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center w-full pt-10 gap-4">
        <p className="text-2xl font-bold text-black font-pretendard whitespace-nowrap">
          @@@님이 쓴 문의 (6)
        </p>

        <Button
          type="export"
          className="ml-auto whitespace-nowrap flex items-center gap-2 px-4 py-3"
        >
          <Upload />
          <p className="text-heading3 text-gray-80 m-0">Export</p>
        </Button>
      </div>

      {/* <div className="w-full mt-10">
        {activeTab === "written" && <WrittenInquiries />}
        {activeTab === "assigned" && <AssignedInquiries />}
        {activeTab === "scrap" && <ScrappedInquiries />}
      </div> */}
    </section>
  );
};

export default UserSpacePage;
