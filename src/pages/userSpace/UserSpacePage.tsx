import { useState } from "react";

import Heart from "@/assets/svgs/common/heart.svg";
import HeartActive from "@/assets/svgs/common/heart-active.svg";
import Profile from "@/assets/svgs/common/profile.svg";
import Upload from "@/assets/svgs/common/upload.svg";
import Pencil from "@/assets/svgs/layout/pencil.svg";
import Button from "@/components/common/Button";
import { USER_SPACE_TABS } from "@/constants/userSpace";

const UserSpacePage = () => {
  const [isHearted, setIsHearted] = useState(false);
  const [activeTab, setActiveTab] =
    useState<(typeof USER_SPACE_TABS)[number]["key"]>("written");

  const getTabClass = (tabKey: string) =>
    [
      activeTab === tabKey
        ? "bg-state-progress-01 border-[2px] border-main"
        : "bg-white border border-gray-20",
      "flex flex-col justify-center items-center gap-4 rounded-[13px] px-10 w-full max-w-[463px] h-[160px]",
    ].join(" ");

  return (
    <section>
      <div className="flex flex-wrap  items-center w-full">
        <div className="w-40 h-40 rounded-full overflow-hidden relative shrink-0">
          <Profile className="w-full h-full object-cover" />
        </div>

        <div className="pl-10 flex-1 min-w-[180px]">
          <h1 className="text-heading1 text-black whitespace-nowrap">
            @@@님의 스페이스
          </h1>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-heading3-sb text-main">Core 개발 2부</span>
            <span className="text-body2 text-gray-60 whitespace-nowrap">
              경영 기획 그룹 &gt; ICT 본부
            </span>
          </div>
        </div>

        <div className="flex gap-4 ml-auto">
          <Button
            buttonType="blue"
            className="flex items-center gap-2 whitespace-nowrap px-4 py-3"
          >
            <Pencil className="w-4 h-4 text-white" />
            <span className="text-heading3 text-white">
              @@@님에게 문의 작성
            </span>
          </Button>

          <Button
            buttonType="white"
            onClick={() => setIsHearted(prev => !prev)}
          >
            {isHearted ? (
              <HeartActive className="w-[24px] h-[24px] aspect-square" />
            ) : (
              <Heart className="w-[24px] h-[24px] aspect-square" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 pt-20 w-full overflow-x-auto scrollbar-hide">
        {USER_SPACE_TABS.map(
          ({
            key,
            label,
            activeIcon: ActiveIcon,
            inactiveIcon: InactiveIcon,
          }) => (
            <Button
              key={key}
              buttonType="none"
              className={getTabClass(key)}
              onClick={() => setActiveTab(key)}
            >
              {activeTab === key ? (
                <ActiveIcon className="w-10 h-10" />
              ) : (
                <InactiveIcon className="w-10 h-10" />
              )}
              <span
                className={`text-heading2-b ${
                  activeTab === key ? "text-main-dark" : "text-gray-50"
                }`}
              >
                {label}
              </span>
            </Button>
          )
        )}
      </div>

      <div className="flex flex-wrap  items-center w-full pt-10">
        <p className="text-heading1 text-black  whitespace-nowrap">
          @@@님이 쓴 문의 (6)
        </p>

        <Button
          buttonType="default"
          className="ml-auto whitespace-nowrap flex items-center gap-2 px-4 py-3"
        >
          <Upload />
          <p className="text-heading3 text-gray-80">Export</p>
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
