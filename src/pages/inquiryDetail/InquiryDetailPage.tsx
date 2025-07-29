import { useParams } from "react-router-dom";

import Header from "@/components/inquiry/detail/Header";
import InquiryCard from "@/components/inquiry/detail/InquiryCard";
import { mockInquiryDetailResponse } from "@/mocks/mockInquiryDetailResponse";

const InquiryDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // mockInquiryDetailResponse에서 해당 inquiry 찾기
  const inquiry = mockInquiryDetailResponse.inquiries.find(
    item => item.inquiry_id === Number(id)
  );

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-05 p-8">
        <div className="max-w-screen-xl mx-auto">
          <Header teamData={mockInquiryDetailResponse} />
          <div className="mt-8 p-16 bg-white rounded-2xl text-center">
            <h2 className="text-xl text-gray-80">문의를 찾을 수 없습니다.</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-05 p-8">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-8">
        {/* 헤더 */}
        <Header teamData={mockInquiryDetailResponse} />

        {/* 문의글 카드 */}
        <InquiryCard inquiry={inquiry} />

        {/* 답변 컴포넌트는 나중에 추가 */}
        {/* <AnswerCard /> */}
      </div>
    </div>
  );
};

export default InquiryDetailPage;
