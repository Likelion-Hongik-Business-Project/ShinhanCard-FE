import InquiryPageLayout from "@/components/inquiry/layout/InquiryPageLayout";
import { AssignedInquiryItem } from "@/types/inquiry";
import { MOCK_ASSIGNED_INQUIRY_RESPONSE } from "@/mocks/inquiryMock";

const AssignedPage = () => {
  return (
    <InquiryPageLayout<AssignedInquiryItem>
      title="내 담당 문의"
      description="나의 담당 문의가 총"
      emptyText="나의 담당 문의가 없습니다"
      inquiries={MOCK_ASSIGNED_INQUIRY_RESPONSE.inquiries}
      teams={MOCK_ASSIGNED_INQUIRY_RESPONSE.teams}
      selectedTeamId={MOCK_ASSIGNED_INQUIRY_RESPONSE.selected_team.team_id}
      pageSize={MOCK_ASSIGNED_INQUIRY_RESPONSE.pagination.page_size}
    />
  );
};

export default AssignedPage;
