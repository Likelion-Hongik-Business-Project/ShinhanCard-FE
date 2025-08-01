import InquiryPageLayout from "@/components/inquiry/layout/InquiryPageLayout";
import { MyInquiryItem } from "@/types/inquiry";
import { MOCK_MY_QUESTIONS_RESPONSE } from "@/mocks/myQuestionsMock";

const MyQuestionsPage = () => {
  return (
    <InquiryPageLayout<MyInquiryItem>
      title="내가 쓴 문의"
      description="내가 쓴 문의가 총"
      emptyText="내가 쓴 문의가 없습니다"
      inquiries={MOCK_MY_QUESTIONS_RESPONSE.inquiries}
      teams={MOCK_MY_QUESTIONS_RESPONSE.teams}
      selectedTeamId={MOCK_MY_QUESTIONS_RESPONSE.selected_team.team_id}
      writer={{
        user_id: MOCK_MY_QUESTIONS_RESPONSE.writer.id,
        name: MOCK_MY_QUESTIONS_RESPONSE.writer.name,
        profile_image_url: MOCK_MY_QUESTIONS_RESPONSE.writer.profile_image_url,
      }}
      pageSize={MOCK_MY_QUESTIONS_RESPONSE.pagination.page_size}
    />
  );
};

export default MyQuestionsPage;
