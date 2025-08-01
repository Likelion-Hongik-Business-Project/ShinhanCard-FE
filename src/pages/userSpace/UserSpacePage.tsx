// import { useState } from "react";

// import HeartActive from "@/assets/svgs/common/heart-active.svg";
// import Heart from "@/assets/svgs/common/heart.svg";
// import Profile from "@/assets/svgs/common/profile.svg";
// import Pencil from "@/assets/svgs/layout/pencil.svg";
// import Button from "@/components/common/Button";
// import { USER_SPACE_TABS } from "@/constants/userSpace";

// import InquiryList from "@/components/common/inquiry/InquiryList";
// import TeamTabs from "@/components/common/inquiry/TeamTabs";
// import { MOCK_ASSIGNED_INQUIRY_RESPONSE } from "@/mocks/inquiryMock";

// const UserSpacePage = () => {
//   const [isHearted, setIsHearted] = useState(false);
//   const [activeTab, setActiveTab] =
//     useState<(typeof USER_SPACE_TABS)[number]["key"]>("written");

//   const getTabClass = (tabKey: string) =>
//     [
//       activeTab === tabKey
//         ? "bg-state-progress-01 border-[2px] border-main"
//         : "bg-white border border-gray-20",
//       "flex flex-col justify-center items-center gap-4 rounded-[13px] px-10 w-full max-w-[463px] h-[160px]",
//     ].join(" ");

//   return (
//     <section>
//       <div className="flex flex-wrap items-center w-full">
//         <div className="w-40 h-40 rounded-full overflow-hidden relative shrink-0">
//           <Profile className="w-full h-full object-cover" />
//         </div>

//         <div className="pl-10 flex-1 min-w-[180px]">
//           <h1 className="text-heading1 text-black whitespace-nowrap">
//             @@@님의 스페이스
//           </h1>

//           <div className="flex items-center gap-2 mt-4">
//             <span className="text-heading3-sb text-main">Core 개발 2부</span>
//             <span className="text-body2 text-gray-60 whitespace-nowrap">
//               경영 기획 그룹 &gt; ICT 본부
//             </span>
//           </div>
//         </div>

//         <div className="flex gap-4 ml-auto">
//           <Button
//             buttonType="blue"
//             className="flex items-center gap-2 whitespace-nowrap px-4 py-3"
//           >
//             <Pencil className="w-4 h-4 text-white" />
//             <span className="text-heading3 text-white">
//               @@@님에게 문의 작성
//             </span>
//           </Button>

//           <Button
//             buttonType="white"
//             onClick={() => setIsHearted(prev => !prev)}
//           >
//             {isHearted ? (
//               <HeartActive className="w-[24px] h-[24px] aspect-square" />
//             ) : (
//               <Heart className="w-[24px] h-[24px] aspect-square" />
//             )}
//           </Button>
//         </div>
//       </div>

//       <div className="flex gap-4 pt-20 w-full overflow-x-auto scrollbar-hide">
//         {USER_SPACE_TABS.map(
//           ({
//             key,
//             label,
//             activeIcon: ActiveIcon,
//             inactiveIcon: InactiveIcon,
//           }) => (
//             <Button
//               key={key}
//               buttonType="none"
//               className={getTabClass(key)}
//               onClick={() => setActiveTab(key)}
//             >
//               {activeTab === key ? (
//                 <ActiveIcon className="w-10 h-10" />
//               ) : (
//                 <InactiveIcon className="w-10 h-10" />
//               )}
//               <span
//                 className={`text-heading2-b ${
//                   activeTab === key ? "text-main-dark" : "text-gray-50"
//                 }`}
//               >
//                 {label}
//               </span>
//             </Button>
//           )
//         )}
//       </div>
//     </section>
//   );
// };

// export default UserSpacePage;

import { useState } from "react";

import Heart from "@/assets/svgs/common/heart.svg";
import HeartActive from "@/assets/svgs/common/heart-active.svg";
import Profile from "@/assets/svgs/common/profile.svg";
import Pencil from "@/assets/svgs/layout/pencil.svg";
import Button from "@/components/common/Button";
import InquiryList from "@/components/common/inquiry/InquiryList";
import TeamTabs from "@/components/common/inquiry/TeamTabs";
import { USER_SPACE_TABS } from "@/constants/userSpace";
import { MOCK_ASSIGNED_INQUIRY_RESPONSE } from "@/mocks/inquiryMock";

const UserSpacePage = () => {
  const [isHearted, setIsHearted] = useState(false);
  const [activeTab, setActiveTab] =
    useState<(typeof USER_SPACE_TABS)[number]["key"]>("written");

  // 문의 리스트 관련 상태들 (assigned 탭용)
  const ITEMS_PER_PAGE = MOCK_ASSIGNED_INQUIRY_RESPONSE.pagination.page_size;
  const totalInquiries = MOCK_ASSIGNED_INQUIRY_RESPONSE.total_count;
  const totalPages = Math.ceil(totalInquiries / ITEMS_PER_PAGE);

  const [selectedTeamId, setSelectedTeamId] = useState(
    MOCK_ASSIGNED_INQUIRY_RESPONSE.selected_team.team_id
  );
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedDate, setSelectedDate] = useState<
    { year: number; month: number }[]
  >([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentItems = MOCK_ASSIGNED_INQUIRY_RESPONSE.inquiries
    .slice(startIndex, endIndex)
    .map(item => ({
      id: item.inquiry_id,
      team_id: selectedTeamId,
      leftProfiles: [
        {
          user_id: item.writer.user_id,
          name: item.writer.name,
          profile_image_url: item.writer.profile_image_url,
        },
      ],
      title: item.title,
      status: item.status,
      created_at: item.created_at,
      is_scraped: item.is_scraped,
    }));

  const filteredInquiries =
    selectedStatus === "전체"
      ? currentItems
      : currentItems.filter(item => item.status === selectedStatus);

  const handleSelectTeam = (teamId: number) => {
    setSelectedTeamId(teamId);
    setCurrentPage(1);
    setSelectedStatus("전체");
    setSelectedDate([]);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleStatusModal = () => {
    setIsStatusModalOpen(prev => !prev);
    setIsDateModalOpen(false);
  };

  const toggleDateModal = () => {
    setIsDateModalOpen(prev => !prev);
    setIsStatusModalOpen(false);
  };

  const getTabClass = (tabKey: string) =>
    [
      activeTab === tabKey
        ? "bg-state-progress-01 border-[2px] border-main"
        : "bg-white border border-gray-20",
      "flex flex-col justify-center items-center gap-4 rounded-[13px] px-10 w-full max-w-[463px] h-[160px]",
    ].join(" ");

  return (
    <section>
      {/* 유저 기본 정보 및 상단 버튼 */}
      <div className="flex flex-wrap items-center w-full">
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

      {/* 탭 버튼들 */}
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

      {/* 탭별 콘텐츠 */}
      <div className="pt-10">
        {activeTab === "assigned" && (
          <>
            <TeamTabs
              teams={MOCK_ASSIGNED_INQUIRY_RESPONSE.teams}
              selectedTeamId={selectedTeamId}
              onSelectTeam={handleSelectTeam}
            />

            <InquiryList
              inquiries={filteredInquiries}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              isStatusModalOpen={isStatusModalOpen}
              setIsStatusModalOpen={setIsStatusModalOpen}
              isDateModalOpen={isDateModalOpen}
              setIsDateModalOpen={setIsDateModalOpen}
              toggleStatusModal={toggleStatusModal}
              toggleDateModal={toggleDateModal}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default UserSpacePage;
