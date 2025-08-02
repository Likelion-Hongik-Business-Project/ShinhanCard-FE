export type InquiryState =
  | "BEFORE_CONFIRM"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PENDING";

// 상태 매핑
export const STATUS_MAPPING: Record<string, InquiryState> = {
  OPEN: "BEFORE_CONFIRM",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "COMPLETED",
  CLOSED: "COMPLETED",
} as const;

// 한글 상태명
export const INQUIRY_STATE_LABELS: Record<InquiryState, string> = {
  BEFORE_CONFIRM: "확인 전",
  IN_PROGRESS: "확인 중",
  COMPLETED: "답변 완료",
  PENDING: "등록 보류",
};

// 상태별 스타일
export const INQUIRY_STATE_STYLES: Record<
  string,
  { bg: string; text: string; dot: string; border?: string }
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
  "등록 보류": {
    bg: "bg-white",
    text: "text-point-yellow",
    dot: "bg-point-yellow",
    border: "border border-point-yellow", // 등록 보류 상태에만 추가 적용
  },
};

// 상태별 비즈니스 규칙
export const INQUIRY_STATE_RULES: Record<
  InquiryState,
  {
    showToPublic: boolean;
    allowAnswers: boolean;
    allowEdit: boolean;
    allowDelete: boolean;
    requiresAllConfirmed: boolean;
  }
> = {
  BEFORE_CONFIRM: {
    showToPublic: true,
    allowAnswers: true,
    allowEdit: true,
    allowDelete: true,
    requiresAllConfirmed: false,
  },
  IN_PROGRESS: {
    showToPublic: true,
    allowAnswers: true,
    allowEdit: true,
    allowDelete: true,
    requiresAllConfirmed: false,
  },
  COMPLETED: {
    showToPublic: true,
    allowAnswers: false,
    allowEdit: false,
    allowDelete: false,
    requiresAllConfirmed: true,
  },
  PENDING: {
    showToPublic: false,
    allowAnswers: false,
    allowEdit: true,
    allowDelete: true,
    requiresAllConfirmed: true,
  },
};
