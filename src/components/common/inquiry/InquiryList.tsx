import { useState } from "react";

import clsx from "clsx";

import Down from "@/assets/svgs/common/down.svg";
import Clock from "@/assets/svgs/common/inquiryList/clock.svg";
import Hash from "@/assets/svgs/common/inquiryList/hash.svg";
import Loader from "@/assets/svgs/common/inquiryList/loader.svg";
import User from "@/assets/svgs/common/inquiryList/user.svg";
import ProfileIcon from "@/assets/svgs/common/profile.svg";
import Star from "@/assets/svgs/common/star.svg";
import StarActive from "@/assets/svgs/common/star-active.svg";
import Up from "@/assets/svgs/common/up.svg";
import DateFilterModal from "@/components/common/inquiry/DateFilterModal";
import StatusFilterModal from "@/components/common/inquiry/StatusFilterModal";
import Pagination from "@/components/common/Pagination";
import { INQUIRY_STATUS_STYLES } from "@/constants/inquiry";
import { InquiryListItem } from "@/types/inquiry";

type Props = {
  inquiries: InquiryListItem[];
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  dateFilter: { year: number; month: number }[];
  setDateFilter: React.Dispatch<
    React.SetStateAction<{ year: number; month: number }[]>
  >;
  isStatusModalOpen: boolean;
  setIsStatusModalOpen: (open: boolean) => void;
  isDateModalOpen: boolean;
  setIsDateModalOpen: (open: boolean) => void;
  toggleStatusModal: () => void;
  toggleDateModal: () => void;
};

const InquiryList = ({
  inquiries,
  selectedStatus,
  setSelectedStatus,
  currentPage,
  totalPages,
  onPageChange,
  dateFilter,
  setDateFilter,
  isStatusModalOpen,
  setIsStatusModalOpen,
  isDateModalOpen,
  setIsDateModalOpen,
  toggleStatusModal,
  toggleDateModal,
}: Props) => {
  const [scrapStates, setScrapStates] = useState<Record<number, boolean>>(
    inquiries.reduce(
      (acc, item) => {
        acc[item.id] = item.is_scraped;
        return acc;
      },
      {} as Record<number, boolean>
    )
  );
  const [clickedButton, setClickedButton] = useState(false);
  const isFiltering = dateFilter.length > 0;

  const [clickedDateButton, setClickedDateButton] = useState(false);

  const handleToggleScrap = (id: number) => {
    setScrapStates(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredInquiries = inquiries.filter(item => {
    const date = new Date(item.created_at);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (dateFilter.length === 0) return true;

    return dateFilter.some(
      filter => filter.year === year && filter.month === month
    );
  });
  return (
    <div>
      <div className="w-full bg-white rounded-b-[15px] rounded-tr-[15px]">
        {/* 헤더 */}
        <div className="h-16 flex text-gray-60 items-center">
          <div className="flex w-full">
            {/* 작성자 */}
            <div className="ml-20 px-4 flex items-center gap-2 w-40 whitespace-nowrap">
              <User />
              <span className="text-body1">작성자</span>
            </div>

            {/* 문의 제목 */}
            <div className="px-4 flex flex-1 items-center gap-2 min-w-[468px] whitespace-nowrap">
              <Hash />
              <span className="text-body1">문의 제목</span>
            </div>

            {/* 문의 상태 */}
            <div className="relative">
              <button
                onMouseDown={() => setClickedButton(true)}
                onClick={toggleStatusModal}
                className={clsx(
                  "transition-colors cursor-pointer px-4 flex items-center gap-2 whitespace-nowrap",
                  {
                    "text-gray-80 text-body1-b": isStatusModalOpen,
                    [`${INQUIRY_STATUS_STYLES[selectedStatus]?.text} text-body1-b`]:
                      selectedStatus !== "전체" && !isStatusModalOpen,
                    "text-gray-60 text-body1":
                      selectedStatus === "전체" && !isStatusModalOpen,
                  }
                )}
              >
                <Loader
                  className={clsx({
                    "text-gray-80": isStatusModalOpen,
                    [INQUIRY_STATUS_STYLES[selectedStatus]?.text]:
                      selectedStatus !== "전체" && !isStatusModalOpen,
                    "text-gray-40":
                      selectedStatus === "전체" && !isStatusModalOpen,
                  })}
                />
                <span>문의 상태</span>
                {isStatusModalOpen ? (
                  <Up className="text-gray-80" />
                ) : (
                  <Down
                    className={clsx({
                      [INQUIRY_STATUS_STYLES[selectedStatus]?.text]:
                        selectedStatus !== "전체",
                      "text-gray-50": selectedStatus === "전체",
                    })}
                  />
                )}
              </button>

              {isStatusModalOpen && (
                <StatusFilterModal
                  selectedStatus={selectedStatus}
                  onSelectStatus={status => {
                    setSelectedStatus(status);
                    setIsStatusModalOpen(false);
                  }}
                  onClose={() => setIsStatusModalOpen(false)}
                  clickedButton={clickedButton}
                  setClickedButton={setClickedButton}
                />
              )}
            </div>

            {/* 문의 일시 */}
            <div className="relative">
              <button
                onMouseDown={() => setClickedDateButton(true)}
                onClick={toggleDateModal}
                className={clsx(
                  "px-4 cursor-pointer flex items-center gap-2 whitespace-nowrap transition-colors w-[251px]",
                  {
                    "text-gray-80 text-body1-b": isDateModalOpen,
                    "text-main text-body1-b": isFiltering && !isDateModalOpen,
                    "text-gray-60 text-body1": !isFiltering && !isDateModalOpen,
                  }
                )}
              >
                <Clock
                  className={clsx({
                    "text-gray-80": isDateModalOpen,
                    "text-main": isFiltering && !isDateModalOpen,
                    "text-gray-40": !isFiltering && !isDateModalOpen,
                  })}
                />
                <span>문의 일시 {isFiltering ? "(필터링 중)" : "(전체)"}</span>
                {isDateModalOpen ? (
                  <Up className="text-gray-80" />
                ) : (
                  <Down
                    className={clsx({
                      "text-main": isFiltering,
                      "text-gray-50": !isFiltering,
                    })}
                  />
                )}
              </button>

              {isDateModalOpen && (
                <DateFilterModal
                  selectedItems={dateFilter}
                  onChange={newItems => setDateFilter(newItems)}
                  onClose={() => setIsDateModalOpen(false)}
                  clickedButton={clickedDateButton}
                  setClickedButton={setClickedDateButton}
                />
              )}
            </div>
          </div>
        </div>

        {/* 리스트 */}
        {filteredInquiries.map(item => (
          <li
            key={item.id}
            className="h-16 border-t-[1px] border-y-gray-10 rounded-b-[15px] bg-white flex w-full"
          >
            {/* 스크랩 */}
            <button
              className="px-4 w-20 flex items-center justify-center"
              onClick={() => handleToggleScrap(item.id)}
            >
              {scrapStates[item.id] ? (
                <StarActive className="cursor-pointer" />
              ) : (
                <Star className="text-gray-30 cursor-pointer" />
              )}
            </button>

            {/* 프로필 */}
            <div className="px-4 w-40 flex items-center gap-2">
              {item.leftProfiles.length > 0 && (
                <>
                  {item.leftProfiles[0].profile_image_url ? (
                    <img
                      src={item.leftProfiles[0].profile_image_url}
                      alt={item.leftProfiles[0].name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <ProfileIcon className="w-6 h-6 rounded-full" />
                  )}
                  <span className="text-body1 text-gray-100">
                    {item.leftProfiles[0].name}
                  </span>
                </>
              )}
            </div>

            {/* 제목 */}
            <span className="text-body1 flex items-center text-gray-100 flex-1 min-w-[468px] px-4">
              {item.title}
            </span>

            {/* 상태 */}
            <div className="w-40 px-4 flex items-center">
              <div
                className={`flex items-center pl-2 pr-3 gap-2 h-8 rounded-[30px] ${INQUIRY_STATUS_STYLES[item.status].bg} ${INQUIRY_STATUS_STYLES[item.status].text}`}
              >
                <div
                  className={`rounded-full w-2 h-2 ${INQUIRY_STATUS_STYLES[item.status].dot}`}
                />
                <span className="text-body1">{item.status}</span>
              </div>
            </div>

            {/* 날짜 */}
            <div className="w-[252px] flex items-center px-4">
              <span className="text-gray-100 text-body1">
                {new Date(item.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </li>
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default InquiryList;
