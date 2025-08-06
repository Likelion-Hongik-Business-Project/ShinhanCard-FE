import {
  InquiryServerStatus,
  InquiryStatus,
} from "@/types/inquiry/inquiryListApi.type";

export const INQUIRY_STATUS_LABEL: Record<
  InquiryServerStatus,
  InquiryStatus | null
> = {
  DRAFT: null, // UI에 표시하지 않음
  UNCHECKED: "확인 전",
  IN_PROGRESS: "확인 중",
  COMPLETED: "답변 완료",
};

export const getInquiryStatusLabel = (
  status: InquiryServerStatus
): InquiryStatus | null => INQUIRY_STATUS_LABEL[status] ?? null;
