import { useParams } from "react-router-dom";

import Header from "@/components/inquiry/detail/Header";
import InquiryCard from "@/components/inquiry/detail/InquiryCard";
import { mockInquiryDetailResponse } from "@/mocks/mockInquiryDetailResponse";
import { InquiryData } from "@/types/inquiryTypes";

const InquiryDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // mockInquiryDetailResponse에서 해당 inquiry 찾기
  const inquiry = mockInquiryDetailResponse.inquiries.find(
    item => item.inquiry_id === Number(id)
  ) as InquiryData | undefined;

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-05 p-8">
        <div className="max-w-screen-xl mx-auto">
          <Header />
          <div className="mt-8 p-16 bg-white rounded-2xl text-center">
            <h2 className="text-xl text-gray-80">문의를 찾을 수 없습니다.</h2>
          </div>
        </div>
      </div>
    );
  }

  // 각 문의별 테스트 시나리오의 권한과 사용자 ID 사용
  const userRole = inquiry.test_user_role;
  const currentUserId = inquiry.test_current_user_id;

  // 🆕 팀 정보는 고정값 또는 별도 API에서 가져오기
  const teamInfo = {
    group_name: "경영기획 그룹",
    division_name: "ICT 기획본부",
    team_name: "Core 개발 2부팀"
  };

  return (
    <div className="min-h-screen bg-gray-05 p-8">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-8">
        {/* 헤더 */}
        <Header isAdmin={userRole === "admin"} />

        {/* 문의글 카드 - 자동 권한 설정 */}
        <InquiryCard
          inquiry={inquiry}
          userRole={userRole}
          currentUserId={currentUserId}
        />

        {/* 답변 컴포넌트는 나중에 추가 */}
        {/* <AnswerCard /> */}
      </div>
    </div>
  );
};

export default InquiryDetailPage;