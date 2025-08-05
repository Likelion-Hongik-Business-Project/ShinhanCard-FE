import { Dispatch, SetStateAction, useState } from "react";

import FilterBar from "@/components/common/FilterBar";
import Pagination from "@/components/common/Pagination";
import Header from "@/components/TeamBoard/Header";
import InquiryList from "@/components/TeamBoard/InquiryList";
import {
  Inquiry,
  SelectedTeam,
  TPagination,
} from "@/types/teamInquires/teamInquiresApi.type";

type Props = {
  selected_team: SelectedTeam;
  inquiries: Inquiry[];
  pagination: TPagination;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedDate: { year: number; month: number }[];
  setSelectedDate: Dispatch<SetStateAction<{ year: number; month: number }[]>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};

const TeamBoardLayout = ({
  selected_team,
  inquiries,
  pagination,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
  currentPage,
  setCurrentPage,
}: Props) => {
  // 페이지네이션
  const totalPages = pagination.total;

  // 모달 상태
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 모달 토글 함수: 상태 모달과 일시 모달 둘 중 하나만 열리게
  const toggleStatusModal = () => {
    setIsStatusModalOpen(prev => !prev);
    setIsDateModalOpen(false);
  };

  const toggleDateModal = () => {
    setIsDateModalOpen(prev => !prev);
    setIsStatusModalOpen(false);
  };

  // 엑셀 다운로드 함수
  const handleExport = () => {
    alert("엑셀 다운로드 기능");
  };

  // 문의 작성 함수
  const handleWrite = () => {
    alert("엑셀 다운로드 기능");
  };

  return (
    <div className="w-full mx-auto flex flex-col gap-10">
      <Header
        group_name={selected_team.group_name}
        division_name={selected_team.division_name}
        team_name={selected_team.team_name}
        isActive={selected_team.active}
        onClickExport={() => handleExport()}
        onClickWrite={() => handleWrite()}
      />

      <div className="bg-white rounded-[15px] flex flex-col h-[652px] overflow-auto">
        <div className="flex justify-end border-b border-gray-10">
          <FilterBar
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
        </div>
        <InquiryList
          group_name={selected_team.group_name}
          division_name={selected_team.division_name}
          team_name={selected_team.team_name}
          inquiries={inquiries}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TeamBoardLayout;
