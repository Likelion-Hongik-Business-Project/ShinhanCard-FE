import { Dispatch, SetStateAction, useState } from "react";

import { useNavigate } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import InquiryListHeader from "@/components/inquiry/list/InquiryListHeader";
import Header from "@/components/TeamBoard/Header";
import InquiryList from "@/components/TeamBoard/InquiryList";
import { ExportOption } from "@/types/excel/excelApi.type";
import {
  InquiryStatus,
  Pagination as PaginationType,
  YearMonth,
} from "@/types/inquiry/inquiryListApi.type";
import {
  Inquiry,
  SelectedTeam,
} from "@/types/teamInquires/teamInquiresApi.type";

type Props = {
  selected_team: SelectedTeam;
  inquiries: Inquiry[];
  pagination: PaginationType;
  selectedStatus: string;
  setSelectedStatus: (status: InquiryStatus | "전체") => void;
  selectedDate: YearMonth[];
  setSelectedDate: Dispatch<SetStateAction<YearMonth[]>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  onExport: (option: ExportOption) => void;
  openAddMemberSidebar: (teamName: string, teamId: number) => void;
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
  onExport,
  openAddMemberSidebar,
}: Props) => {
  const navigate = useNavigate();

  // 페이지네이션
  const totalPages = Math.ceil(pagination.total / pagination.page_size);

  // 필터링 여부
  const isFiltering =
    selectedStatus !== "전체" || (selectedDate && selectedDate.length > 0);

  // 데이터 여부
  const hasInquiry = pagination.total > 0;

  // Export 노출 조건: 필터링 전 + 데이터 있음
  const showExport = !isFiltering && hasInquiry;

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

  // 문의 작성 함수
  const handleWrite = () => {
    navigate("/inquiry/form", {
      state: {
        groupName: selected_team.group_name,
        divisionName: selected_team.division_name,
        teamName: selected_team.team_name,
        teamId: selected_team.team_id,
      },
    });
  };

  if (showExport) {
    return (
      <div className="w-full mx-auto flex flex-col gap-10">
        <Header
          group_name={selected_team.group_name}
          division_name={selected_team.division_name}
          team_name={selected_team.team_name}
          team_id={selected_team.team_id}
          isActive={selected_team.active}
          hasInquiry={false} // Export 안 보여주게
          onExport={onExport}
          onClickWrite={handleWrite}
          openAddMemberSidebar={openAddMemberSidebar}
        />
        <div className="flex items-center justify-center flex-1 min-h-[520px]">
          <span className="text-gray-40 text-heading2-b">문의가 없습니다</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto flex flex-col gap-10">
      <Header
        group_name={selected_team.group_name}
        division_name={selected_team.division_name}
        team_name={selected_team.team_name}
        team_id={selected_team.team_id}
        isActive={selected_team.active}
        hasInquiry={hasInquiry}
        onExport={onExport}
        onClickWrite={() => handleWrite()}
        openAddMemberSidebar={openAddMemberSidebar}
      />

      <div className="bg-white rounded-[15px] flex flex-col">
        <div className="flex justify-end border-b border-gray-10 z-10">
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
            showAuthor={false}
            showTitle={false}
          />
        </div>

        {hasInquiry && (
          <InquiryList
            team_id={selected_team.team_id}
            group_name={selected_team.group_name}
            division_name={selected_team.division_name}
            team_name={selected_team.team_name}
            inquiries={inquiries}
          />
        )}
      </div>
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TeamBoardLayout;
