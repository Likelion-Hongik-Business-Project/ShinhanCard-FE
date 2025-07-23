import { useState } from "react";

import Upload from "@/assets/svgs/common/upload.svg";
import InquiryList from "@/components/common/inquiry/InquiryList";
import TeamTabs from "@/components/common/inquiry/TeamTabs";
import { MOCK_ASSIGNED_INQUIRY_RESPONSE } from "@/mocks/inquiryMock";

const AssignedPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeamId, setSelectedTeamId] = useState(
    MOCK_ASSIGNED_INQUIRY_RESPONSE.selected_team.team_id
  );
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [dateFilter, setDateFilter] = useState<
    { year: number; month: number }[]
  >([]);
  const ITEMS_PER_PAGE = MOCK_ASSIGNED_INQUIRY_RESPONSE.pagination.page_size;
  const totalInquiries = MOCK_ASSIGNED_INQUIRY_RESPONSE.total_count;
  const totalPages = Math.ceil(totalInquiries / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentItems = MOCK_ASSIGNED_INQUIRY_RESPONSE.inquiries
    .slice(startIndex, endIndex)
    .map(item => ({
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
      status: item.status,
      created_at: item.created_at,
      is_scraped: item.is_scraped,
    }));

  // 필터링 로직: 추후 쿼리 파라미터로 API 호출할 예정
  const filteredInquiries =
    selectedStatus === "전체"
      ? currentItems
      : currentItems.filter(item => item.status === selectedStatus);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSelectTeam = (teamId: number) => {
    setSelectedTeamId(teamId);
    setCurrentPage(1);
    setSelectedStatus("전체");
    setDateFilter([]);
  };

  return (
    <section className="w-full">
      {totalInquiries === 0 ? (
        <div className="h-[calc(100vh-224px)]">
          <h1 className="text-gray-80 text-heading1">내 담당 문의</h1>

          <div className="flex w-full h-[calc(100vh-224px)] pb-[118px] justify-center items-center">
            <p className="text-gray-40 text-heading2-b">
              나의 담당 문의가 없습니다.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-10">
            <div className="flex flex-col gap-4">
              <h1 className="text-gray-80 text-heading1">내 담당 문의</h1>
              <p className="text-gray-100 text-body1">
                나의 담당 문의가 총{" "}
                <span className="text-body1-b">{totalInquiries}</span>건
                있습니다.
              </p>
            </div>
            <button className="self-end px-6 flex gap-4 items-center bg-white hover:bg-gray-20 active:bg-gray-20 transition-colors cursor-pointer border border-gray-20 rounded-[15px] h-16">
              <Upload />
              <span className="text-gray-80 text-heading3">Export</span>
            </button>
          </div>

          <TeamTabs
            teams={MOCK_ASSIGNED_INQUIRY_RESPONSE.teams}
            selectedTeamId={selectedTeamId}
            onSelectTeam={handleSelectTeam}
          />

          <InquiryList
            inquiries={filteredInquiries}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
        </>
      )}
    </section>
  );
};

export default AssignedPage;
