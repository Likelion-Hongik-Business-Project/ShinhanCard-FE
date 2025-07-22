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
};

const InquiryList = ({
  inquiries,
  selectedStatus,
  setSelectedStatus,
  currentPage,
  totalPages,
  onPageChange,
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
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleToggleScrap = (id: number) => {
    setScrapStates(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      <div className="w-full bg-white overflow-hidden rounded-b-[15px] rounded-tr-[15px]">
        {/* 헤더 */}
        <div className="h-16 flex text-gray-60 items-center">
          <div className="flex w-full">
            <div className="ml-20 px-4 flex items-center gap-2 w-40 whitespace-nowrap">
              <User />
              <span className="text-body1">작성자</span>
            </div>
            <div className="px-4 flex flex-1 items-center gap-2 min-w-[468px] whitespace-nowrap">
              <Hash />
              <span className="text-body1">문의 제목</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsStatusModalOpen(prev => !prev)}
                className={clsx(
                  "px-4 flex items-center gap-2 whitespace-nowrap",
                  {
                    "text-gray-80 text-body1-b": isStatusModalOpen,
                    "text-main text-body1-b":
                      selectedStatus === "확인 중" && !isStatusModalOpen,
                    [`${INQUIRY_STATUS_STYLES[selectedStatus]?.text} text-body1-b`]:
                      selectedStatus !== "전체" &&
                      selectedStatus !== "확인 중" &&
                      !isStatusModalOpen,
                    "text-gray-60 text-body1":
                      selectedStatus === "전체" && !isStatusModalOpen,
                  }
                )}
              >
                <Loader
                  className={clsx({
                    "text-gray-80": isStatusModalOpen,
                    "text-main":
                      selectedStatus === "확인 중" && !isStatusModalOpen,
                    [INQUIRY_STATUS_STYLES[selectedStatus]?.text]:
                      selectedStatus !== "전체" &&
                      selectedStatus !== "확인 중" &&
                      !isStatusModalOpen,
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
                      "text-main": selectedStatus === "확인 중",
                      [INQUIRY_STATUS_STYLES[selectedStatus]?.text]:
                        selectedStatus !== "전체" &&
                        selectedStatus !== "확인 중",
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
                />
              )}
            </div>
            <div className="px-4 flex items-center gap-2 w-[251px] whitespace-nowrap">
              <Clock />
              <span className="text-body1">문의 일시 (전체)</span>
              <Down className="text-gray-50 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* 리스트 */}
        {inquiries.map(item => (
          <li
            key={item.id}
            className="h-16 border-t-[2px] border-y-gray-10 bg-white flex w-full"
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
