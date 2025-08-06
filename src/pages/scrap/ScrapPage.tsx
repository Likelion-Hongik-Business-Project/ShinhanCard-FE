import InquiryPageLayout from "@/components/inquiry/layout/InquiryPageLayout";
import { ScrapedInquiryItem } from "@/types/inquiry/inquiryListApi.type";
import { MOCK_SCRAP_RESPONSE } from "@/mocks/scrapMock";

const ScrapPage = () => {
  return (
    <InquiryPageLayout<ScrapedInquiryItem>
      title="스크랩"
      description="내가 스크랩한 문의가 총"
      emptyText="스크랩한 문의가 없습니다"
      inquiries={MOCK_SCRAP_RESPONSE.inquiries}
      teams={MOCK_SCRAP_RESPONSE.teams}
      selectedTeamId={MOCK_SCRAP_RESPONSE.selected_team.team_id}
      pageSize={MOCK_SCRAP_RESPONSE.pagination.page_size}
    />
  );
};

export default ScrapPage;
