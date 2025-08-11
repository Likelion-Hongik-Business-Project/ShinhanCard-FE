import { useState } from "react";

import { useParams } from "react-router-dom";

import TeamBoardLayout from "@/components/TeamBoard/layout/TeamBoardLayout";
import { useExcelExport } from "@/hooks/excel/useExcelApi";
import { useTeamInquires } from "@/hooks/teamInquires/useTeamInquiresApi";
import { formatDateParams } from "@/utils/dateUtils";
import { INQUIRY_STATUS_VALUE } from "@/utils/inquiryStatus";
import { ExportOption } from "@/types/excel/excelApi.type";
import { InquiryStatus, YearMonth } from "@/types/inquiry/inquiryListApi.type";

const TeamBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | "전체">(
    "전체"
  );
  const [selectedDate, setSelectedDate] = useState<YearMonth[]>([]);

  // export
  const excelExport = useExcelExport();

  const handleExport = (option: ExportOption) => {
    if (!selected_team?.team_id) return;
    excelExport.mutate({
      scope: "team",
      teamId: selected_team.team_id,
      option,
      status: selectedStatus,
      date: selectedDate,
    });
  };

  // 팀별 게시판 GET
  const { data, isLoading, error } = useTeamInquires({
    team_id: id ? parseInt(id) : undefined,
    page,
    status:
      selectedStatus === "전체"
        ? undefined
        : INQUIRY_STATUS_VALUE[selectedStatus],
    date: formatDateParams(selectedDate),
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error || !data) {
    return;
  }

  const { selected_team, inquiries, pagination } = data;

  return (
    <section className="w-full max-w-[1420px] flex flex-col">
      <TeamBoardLayout
        selected_team={selected_team}
        inquiries={inquiries}
        pagination={{
          page: pagination.page,
          page_size: pagination.page_size,
          total: pagination.total,
          has_next: pagination.has_next,
        }}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentPage={page}
        setCurrentPage={setPage}
        onExport={handleExport}
      />
    </section>
  );
};

export default TeamBoardPage;
