import { useState } from "react";

import InquiryPageLayout from "@/components/inquiry/layout/InquiryPageLayout";
import { useAssignedApi } from "@/hooks/inquiry/assigned/useAssignedApi";
import { formatDateParams } from "@/utils/dateUtils";
import { INQUIRY_STATUS_VALUE } from "@/utils/inquiryStatus";
import {
  AssignedInquiryItem,
  InquiryStatus,
} from "@/types/inquiry/inquiryListApi.type";

const AssignedPage = () => {
  const [page, setPage] = useState(1);
  const [date, setDate] = useState<{ year: number; month: number }[]>([]);
  const [status, setStatus] = useState<InquiryStatus | "전체">("전체");

  const { data, isLoading, isError } = useAssignedApi({
    page: page - 1,
    status: status === "전체" ? undefined : INQUIRY_STATUS_VALUE[status],
    date: formatDateParams(date),
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !data) return <div>에러 발생</div>;

  const { inquiries, teams, selected_team } = data;

  const totalPages = Math.ceil(
    data.pagination.total / data.pagination.page_size
  );

  return (
    <InquiryPageLayout<AssignedInquiryItem>
      title="내 담당 문의"
      description="나의 담당 문의가 총"
      emptyText="나의 담당 문의가 없습니다"
      inquiries={inquiries}
      teams={teams}
      selectedTeamId={selected_team.team_id}
      onSelectTeam={() => {}}
      pageSize={data.pagination.page_size}
      totalCount={data.total_count}
      totalPages={totalPages}
      currentPage={page}
      onPageChange={setPage}
      selectedStatus={status}
      onStatusChange={setStatus}
      selectedDate={date}
      onDateChange={setDate}
    />
  );
};

export default AssignedPage;
