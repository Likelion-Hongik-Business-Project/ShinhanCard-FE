import { useState } from "react";

import Pagination from "@/components/common/Pagination";
import {
  InquiryListItem as InquiryListItemType,
  YearMonth,
} from "@/types/inquiry";

import InquiryListHeader from "./InquiryListHeader";
import InquiryListItem from "./InquiryListItem";

type Props = {
  inquiries: InquiryListItemType[]; // 문의 리스트
  currentPage: number; // 현재 페이지
  totalPages: number; // 총 페이지 수
  onPageChange: (page: number) => void; // 현재 페이지
  selectedStatus: string; // 선택된 상태 필터
  setSelectedStatus: (status: string) => void; // 상태 필터 변경 함수
  selectedDate: YearMonth[]; // 선택된 날짜 필터
  setSelectedDate: React.Dispatch<React.SetStateAction<YearMonth[]>>; // 날짜 필터 변경 함수
  isStatusModalOpen: boolean; // 상태 모달 오픈 여부
  setIsStatusModalOpen: (open: boolean) => void; // 상태 모달 오픈/닫기
  isDateModalOpen: boolean; // 날짜 모달 오픈 여부
  setIsDateModalOpen: (open: boolean) => void; // 날짜 모달 오픈/닫기
  toggleStatusModal: () => void; // 상태 모달 토글
  toggleDateModal: () => void; // 날짜 모달 토글
};

const InquiryList = ({
  inquiries,
  currentPage,
  totalPages,
  onPageChange,
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

  // 스크랩 토글 함수
  const handleToggleScrap = (id: number) => {
    setScrapStates(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 날짜 필터링
  const filteredInquiries = inquiries.filter(item => {
    const date = new Date(item.created_at);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (selectedDate.length === 0) return true;

    return selectedDate.some(
      filter => filter.year === year && filter.month === month
    );
  });

  return (
    <div>
      <div className="w-full bg-white rounded-b-[15px] rounded-tr-[15px]">
        {/* 문의 리스트 헤더 (필터 포함) */}
        <InquiryListHeader
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

        {/* 문의 리스트 */}
        {filteredInquiries.map(item => (
          <InquiryListItem
            key={item.id}
            item={item}
            isScraped={scrapStates[item.id]}
            onToggleScrap={handleToggleScrap}
          />
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
