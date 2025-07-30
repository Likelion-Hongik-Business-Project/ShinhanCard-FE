import { useState } from "react";

import Upload from "@/assets/svgs/common/upload.svg";
import Button from "@/components/common/Button";
import InquiryList from "@/components/common/inquiry/InquiryList";
import TeamTabs from "@/components/common/inquiry/TeamTabs";
import { getInquiryStatusLabel } from "@/utils/inquiryStatus";
import { InquiryListItem } from "@/types/inquiry";
import { MOCK_SCRAP_RESPONSE } from "@/mocks/scrapMock";

const ScrapPage = () => {
  // 페이지네이션
  const ITEMS_PER_PAGE = MOCK_SCRAP_RESPONSE.pagination.page_size; // 10개
  const totalInquiries = MOCK_SCRAP_RESPONSE.total_count; // 총 문의 개수 (ex. 120개)
  const totalPages = Math.ceil(totalInquiries / ITEMS_PER_PAGE); // 총 페이지 (ex. 12개)

  // 팀/필터 관련 상태
  const [selectedTeamId, setSelectedTeamId] = useState(
    MOCK_SCRAP_RESPONSE.selected_team.team_id
  );
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
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // 현재 페이지 문의들
  const currentItems = MOCK_SCRAP_RESPONSE.inquiries
    .slice(startIndex, endIndex)
    .map(item => {
      const statusLabel = getInquiryStatusLabel(item.status);
      if (!statusLabel) return null; // DRAFT면 건너뜀

      return {
        id: item.inquiry_id,
        team_id: selectedTeamId,
        leftProfiles: [
          {
            user_id: item.writer.user_id,
            name: item.writer.name,
            profile_image_url: item.writer.profile_image_url,
          },
        ],
        title: item.title,
        status: statusLabel,
        created_at: item.created_at,
        is_scraped: item.is_scraped,
      };
    })
    .filter((item): item is InquiryListItem => item !== null);

  // 필터링 로직: 추후 쿼리 파라미터로 API 호출할 예정
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

  // 페이지 변경
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 모달 토글 & 둘 모달 중 하나만 열리게
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
    <section className="w-full">
      <>
        <div className="flex justify-between mb-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-gray-80 text-heading1">스크랩</h1>
            <p className="text-gray-100 text-body1">
              내가 스크랩한 문의가 총{" "}
              <span className="text-body1-b">{totalInquiries}</span>건 있습니다.
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
            <p className="text-gray-40 text-heading2-b">
              스크랩한 문의가 없습니다
            </p>
          </div>
        ) : (
          <>
            <TeamTabs
              teams={MOCK_SCRAP_RESPONSE.teams}
              selectedTeamId={selectedTeamId}
              onSelectTeam={handleSelectTeam}
            />

            <InquiryList
              inquiries={filteredInquiries}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
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
    </section>
  );
};

export default ScrapPage;
