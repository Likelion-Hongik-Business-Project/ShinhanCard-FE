import { useState } from "react";

import Upload from "@/assets/svgs/common/upload.svg";
import Button from "@/components/common/Button";
import InquiryList from "@/components/inquiry/list/InquiryList";
import TeamTabs from "@/components/inquiry/list/TeamTabs";
import { getInquiryStatusLabel } from "@/utils/inquiryStatus";
import {
  InquiryListItem,
  InquiryServerStatus,
  Profile,
  TeamItem,
  TInquiryBase,
} from "@/types/inquiry/inquiryListApi.type";

type Props<TInquiry> = {
  title: string;
  description: string;
  emptyText: string;
  inquiries: TInquiry[]; // 서버 data
  teams: TeamItem[];
  selectedTeamId: number;
  writer?: Profile; // 내가 쓴 문의일 경우
  pageSize: number;
};

const InquiryPageLayout = <TInquiry extends TInquiryBase>({
  title,
  description,
  emptyText,
  inquiries,
  teams,
  selectedTeamId: initialTeamId,
  writer,
  pageSize,
}: Props<TInquiry>) => {
  // 페이지네이션
  const totalInquiries = inquiries.length;
  const totalPages = Math.ceil(totalInquiries / pageSize);

  // 팀/필터 관련 상태
  const [selectedTeamId, setSelectedTeamId] = useState(initialTeamId);
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedDate, setSelectedDate] = useState<
    { year: number; month: number }[]
  >([]);

  // 모달 상태
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 페이지 문의 index
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 현재 페이지 문의들
  const currentItems = inquiries
    .slice(startIndex, endIndex)
    .map((item: TInquiry) => {
      const statusLabel = getInquiryStatusLabel(
        item.status as InquiryServerStatus
      );
      if (!statusLabel) return null;

      const profile = writer ?? item.writer!;

      return {
        id: item.inquiry_id,
        team_id: selectedTeamId,
        leftProfiles: [
          {
            user_id: profile.user_id,
            name: profile.name,
            profile_image_url: profile.profile_image_url,
          },
        ],
        title: item.title,
        status: statusLabel,
        created_at: item.created_at,
        is_scraped: item.is_scraped,
      };
    })
    .filter((item): item is InquiryListItem => item !== null);

  // 필터링 로직: 추후 쿼리 파라미터로 API 호출 예정
  const filteredInquiries =
    selectedStatus === "전체"
      ? currentItems
      : currentItems.filter(item => item.status === selectedStatus);

  // 팀 선택 -> TeamTabs
  const handleSelectTeam = (teamId: number) => {
    setSelectedTeamId(teamId);
    setCurrentPage(1);
    setSelectedStatus("전체");
    setSelectedDate([]);
  };

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

  return (
    <>
      <div className="flex justify-between mb-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-gray-80 text-heading1">{title}</h1>
          <p className="text-gray-100 text-body1">
            {description}
            <span className="text-body1-b"> {totalInquiries}</span>건 있습니다.
          </p>
        </div>
        {totalInquiries !== 0 && (
          <Button className="self-end" onClick={handleExport}>
            <Upload />
            <span className="text-gray-80 text-heading3">Export</span>
          </Button>
        )}
      </div>

      {totalInquiries === 0 ? (
        <div className="flex w-full h-[calc(100vh-340px)] pb-[118px] justify-center items-center">
          <p className="text-gray-40 text-heading2-b">{emptyText}</p>
        </div>
      ) : (
        <>
          <TeamTabs
            teams={teams}
            selectedTeamId={selectedTeamId}
            onSelectTeam={handleSelectTeam}
          />

          <InquiryList
            inquiries={filteredInquiries}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
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
        </>
      )}
    </>
  );
};

export default InquiryPageLayout;
