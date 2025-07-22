import { InquiryStatus } from "@/types/inquiry";

export const INQUIRY_STATUSES: InquiryStatus[] = [
  "확인 전",
  "확인 중",
  "답변 완료",
];

export const INQUIRY_STATUS_COLORS: Record<string, string> = {
  "확인 전": "bg-state-before-01 text-state-before-03",
  "확인 중": "bg-state-progress-01 text-state-progress-03",
  "답변 완료": "bg-state-done-01 text-state-done-03",
};
