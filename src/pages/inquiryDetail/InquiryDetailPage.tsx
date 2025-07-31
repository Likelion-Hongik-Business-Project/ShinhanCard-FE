import { useParams } from "react-router-dom";

import Header from "@/components/inquiry/detail/Header";
import InquiryCard from "@/components/inquiry/detail/InquiryCard";
import AnswerSection from "@/components/inquiry/detail/answer/AnswerSection";
import { mockInquiryDetailResponse } from "@/mocks/mockInquiryDetailResponse";
import { InquiryData } from "@/types/inquiryTypes";

const InquiryDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // mockInquiryDetailResponse에서 해당 inquiry 찾기
  const inquiry = mockInquiryDetailResponse.inquiries.find(
    (item) => item.inquiry_id === Number(id)
  ) as InquiryData | undefined;

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-10 p-8">
        <div className="mx-auto max-w-screen-xl">
          <Header />
          <div className="mt-8 rounded-2xl bg-white p-16 text-center">
            <h2 className="text-xl text-gray-80">문의를 찾을 수 없습니다.</h2>
          </div>
        </div>
      </div>
    );
  }

  // 각 문의별 테스트 시나리오의 권한과 사용자 ID 사용
  const userRole = inquiry.test_user_role;
  const currentUserId = inquiry.test_current_user_id;

  return (
    <div className="min-h-screen bg-gray-10 p-8">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-[56px]">
        {/* 헤더 */}
        <Header isAdmin={userRole === "admin"} />

        {/* 문의글 카드 - 자동 권한 설정 */}
        <InquiryCard
          inquiry={inquiry}
          userRole={userRole}
          currentUserId={currentUserId}
        />

        {/* 답변이 있는 경우, 답변 섹션 카드를 별도로 렌더링 */}
        {inquiry.comments && inquiry.comments.length > 0 && (
          <AnswerSection
            comments={inquiry.comments}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  );
};

export default InquiryDetailPage;