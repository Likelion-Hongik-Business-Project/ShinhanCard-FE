import { useState } from "react";

import InquiryList from "@/components/common/inquiry/InquiryList";
import TeamTabs from "@/components/common/inquiry/TeamTabs";
import { MOCK_ASSIGNED_INQUIRY_RESPONSE } from "@/mocks/inquiryMock";

const AssignedPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeamId, setSelectedTeamId] = useState(
    MOCK_ASSIGNED_INQUIRY_RESPONSE.selected_team.team_id
  );

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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSelectTeam = (teamId: number) => {
    setSelectedTeamId(teamId);
    setCurrentPage(1);
    // TODO: 여기서 API 호출로 해당 teamId의 데이터를 가져와야 함
  };

  return (
    <section className="w-full">
      <h1 className="text-gray-80 text-heading1 mb-4">내 담당 문의</h1>
      <p className="text-gray-100 text-body1 mb-6">
        총 <span className="text-body1-b">{totalInquiries}</span>건
      </p>

      <TeamTabs
        teams={MOCK_ASSIGNED_INQUIRY_RESPONSE.teams}
        selectedTeamId={selectedTeamId}
        onSelectTeam={handleSelectTeam}
      />

      <InquiryList
        inquiries={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
};

export default AssignedPage;
