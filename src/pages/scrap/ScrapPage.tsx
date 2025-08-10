import { useEffect, useState } from "react";

import InquiryPageLayout from "@/components/inquiry/layout/InquiryPageLayout";
import { useExcelExport } from "@/hooks/excel/useExcelApi";
import { useInitScrapApi, useScrapByTeamApi } from "@/hooks/scrap/useScrapApi";
import { formatDateParams } from "@/utils/dateUtils";
import { INQUIRY_STATUS_VALUE } from "@/utils/inquiryStatus";
import { ExportOption } from "@/types/excel/excelApi.type";
import {
  InquiryItem,
  InquiryStatus,
} from "@/types/inquiry/inquiryListApi.type";

const ScrapPage = () => {
  const [page, setPage] = useState(1);
  const [date, setDate] = useState<{ year: number; month: number }[]>([]);
  const [status, setStatus] = useState<InquiryStatus | "전체">("전체");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  // export
  const excelExport = useExcelExport();

  const handleExport = (option: ExportOption) => {
    if (!selectedTeamId) return;

    excelExport.mutate({
      scope: "scraped",
      teamId: selectedTeamId,
      option,
      status,
      date,
    });
  };

  // 최초 요청
  const {
    data: initData,
    isLoading: initLoading,
    isError: initError,
  } = useInitScrapApi({
    page: page,
    status: status === "전체" ? undefined : INQUIRY_STATUS_VALUE[status],
    date: formatDateParams(date),
  });

  // 이후 팀 선택 시 요청
  const {
    data: teamData,
    isLoading: teamLoading,
    isError: teamError,
  } = useScrapByTeamApi({
    teamId: selectedTeamId!,
    page: page,
    status: status === "전체" ? undefined : INQUIRY_STATUS_VALUE[status],
    date: formatDateParams(date),
  });

  // 최초 팀 세팅
  useEffect(() => {
    if (!selectedTeamId && initData?.selected_team?.team_id) {
      setSelectedTeamId(initData.selected_team.team_id);
    }
  }, [initData, selectedTeamId]);

  const isLoading = selectedTeamId ? teamLoading : initLoading;
  const isError = selectedTeamId ? teamError : initError;
  const data = selectedTeamId ? teamData : initData;

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !data) return <div>에러 발생</div>;

  const totalPages = Math.ceil(
    data.pagination.total / data.pagination.page_size
  );

  const handleSelectTeam = (teamId: number) => {
    setSelectedTeamId(teamId);
    setPage(1);
    setStatus("전체");
    setDate([]);
  };

  return (
    <InquiryPageLayout<InquiryItem>
      title="스크랩"
      description="내가 스크랩한 문의가 총"
      emptyText="스크랩한 문의가 없습니다"
      inquiries={data.inquiries}
      teams={initData?.teams ?? []}
      selectedTeamId={selectedTeamId!}
      onSelectTeam={handleSelectTeam}
      totalCount={data.total_count}
      totalPages={totalPages}
      currentPage={page}
      onPageChange={setPage}
      selectedStatus={status}
      onStatusChange={setStatus}
      selectedDate={date}
      onDateChange={setDate}
      onExport={handleExport}
    />
  );
};

export default ScrapPage;
