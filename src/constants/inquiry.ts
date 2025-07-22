import { InquiryStatus } from "@/types/inquiry";

export const INQUIRY_STATUSES: InquiryStatus[] = [
  "확인 전",
  "확인 중",
  "답변 완료",
];

export const INQUIRY_STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  "확인 전": {
    bg: "bg-state-before-01",
    text: "text-state-before-03",
    dot: "bg-state-before-02",
  },
  "확인 중": {
    bg: "bg-state-progress-01",
    text: "text-state-progress-03",
    dot: "bg-state-progress-02",
  },
  "답변 완료": {
    bg: "bg-state-done-01",
    text: "text-state-done-03",
    dot: "bg-state-done-02",
  },
};
