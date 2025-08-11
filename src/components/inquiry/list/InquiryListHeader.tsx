import { useRef } from "react";

import clsx from "clsx";

import Down from "@/assets/svgs/common/down.svg";
import Clock from "@/assets/svgs/common/inquiryList/clock.svg";
import Hash from "@/assets/svgs/common/inquiryList/hash.svg";
import Loader from "@/assets/svgs/common/inquiryList/loader.svg";
import User from "@/assets/svgs/common/inquiryList/user.svg";
import DateFilterModal from "@/components/inquiry/list/DateFilterModal";
import StatusFilterModal from "@/components/inquiry/list/StatusFilterModal";
import { INQUIRY_STATUS_STYLES } from "@/constants/inquiry";
import { InquiryStatus, YearMonth } from "@/types/inquiry/inquiryListApi.type";

type Props = {
  selectedStatus: string;
  setSelectedStatus: (status: InquiryStatus | "전체") => void;
  selectedDate: YearMonth[];
  setSelectedDate: React.Dispatch<React.SetStateAction<YearMonth[]>>;
  isStatusModalOpen: boolean;
  setIsStatusModalOpen: (open: boolean) => void;
  isDateModalOpen: boolean;
  setIsDateModalOpen: (open: boolean) => void;
  toggleStatusModal: () => void;
  toggleDateModal: () => void;
  showAuthor?: boolean;
  showTitle?: boolean;
};

const InquiryListHeader = ({
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
  isStatusModalOpen,
  setIsStatusModalOpen,
  isDateModalOpen,
  setIsDateModalOpen,
  toggleStatusModal,
  toggleDateModal,
  showAuthor = true,
  showTitle = true,
}: Props) => {
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const isFiltering = selectedDate.length > 0;

  return (
    <div className="h-16 flex text-gray-60 items-center">
      <div className="flex w-full">
        {/* 작성자 컬럼 */}
        {showAuthor && (
          <div className="ml-20 px-4 flex items-center gap-2 w-40 whitespace-nowrap">
            <User />
            <span className="text-body1">작성자</span>
          </div>
        )}

        {/* 문의 제목 컬럼 */}
        {showTitle && (
          <div className="px-4 flex flex-1 items-center gap-2 min-w-[468px] whitespace-nowrap">
            <Hash />
            <span className="text-body1">문의 제목</span>
          </div>
        )}

        {/* 문의 상태 필터링 버튼 */}
        <div className="relative">
          <button
            ref={statusButtonRef}
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
                "text-gray-40": selectedStatus === "전체" && !isStatusModalOpen,
              })}
            />
            <span>문의 상태</span>
            <Down
              className={clsx(
                "w-6 h-6",
                isStatusModalOpen && "rotate-180 text-gray-80",
                !isStatusModalOpen &&
                  (selectedStatus !== "전체"
                    ? INQUIRY_STATUS_STYLES[selectedStatus]?.text
                    : "text-gray-50")
              )}
            />
          </button>

          {/* 문의 상태 모달 */}
          {isStatusModalOpen && (
            <StatusFilterModal
              selectedStatus={selectedStatus}
              onSelectStatus={status => {
                setSelectedStatus(status as InquiryStatus | "전체");
                setIsStatusModalOpen(false);
              }}
              onClose={() => setIsStatusModalOpen(false)}
              triggerRef={statusButtonRef}
            />
          )}
        </div>

        {/* 문의 일시 필터링 버튼 */}
        <div className="relative">
          <button
            ref={dateButtonRef}
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
            <span>문의 일시 {isFiltering ? "(필터링중)" : "(전체)"}</span>
            <Down
              className={clsx(
                "w-6 h-6",
                isDateModalOpen ? "rotate-180 text-gray-80" : "",
                {
                  "text-main": isFiltering,
                  "text-gray-50": !isFiltering,
                }
              )}
            />
          </button>

          {/* 문의 일시 모달 */}
          {isDateModalOpen && (
            <DateFilterModal
              selectedItems={selectedDate}
              onChange={setSelectedDate}
              onClose={() => setIsDateModalOpen(false)}
              triggerRef={dateButtonRef}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryListHeader;
