import { useParams } from "react-router-dom";

import { mockInquiryDetailResponse } from "@/mocks/mockInquiryDetailResponse";

//inquiryId를 mockData에서 받아, 해당 문의 데이터와 사용자 정보를 반환하는 훅
export const useInquiryData = () => {
  const { id } = useParams<{ id: string }>();

  const inquiry = mockInquiryDetailResponse.inquiries.find(
    item => item.inquiry_id === Number(id)
  );

  // 각 문의별 테스트 시나리오의 권한과 사용자 ID 사용
  const userRole = inquiry?.test_user_role ?? "default";
  const currentUserId = inquiry?.test_current_user_id ?? 0;

  return { inquiry, userRole, currentUserId, inquiryId: id };
};
