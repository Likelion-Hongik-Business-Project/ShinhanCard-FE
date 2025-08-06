import { useState } from "react";

import { useParams } from "react-router-dom";

import TeamBoardLayout from "@/components/TeamBoard/layout/TeamBoardLayout";
import { useTeamInquires } from "@/hooks/teamInquires/useTeamInquiresApi";

const TeamBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("전체");
  const [selectedDate, setSelectedDate] = useState<
    { year: number; month: number }[]
  >([]);

  const { data, isLoading, error } = useTeamInquires({
    team_id: id ? parseInt(id) : undefined,
    page,
    status: selectedStatus,
    date: selectedDate,
  });

  if (isLoading) {
    // Todo: 로딩 시 UI?
    return <div>로딩 중...</div>;
  }

  if (error || !data) {
    //Todo: 에러 뜰 경우 로직 (재시도?)
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
      />
    </section>
  );
};

export default TeamBoardPage;
