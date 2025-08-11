import {
  INQUIRY_STATE_LABELS,
  INQUIRY_STATE_STYLES,
  InquiryState,
  STATUS_MAPPING,
} from "@/constants/inquiryStates";
import { InquiryData, UserRole } from "@/types/inquiryTypes";

export const useInquiryState = (
  inquiry: InquiryData | undefined,
  userRole: UserRole,
  currentUserId?: number
) => {
  if (!inquiry) {
    return {
      isAssigneeEditMode: false,
      permissions: { canEditAssignees: false, showAssigneeFeatures: false },
      isWriter: false,
      isAdmin: false,
      finalStateLabel: "로딩 중...",
      finalStatusConfig: INQUIRY_STATE_STYLES["확인 전"],
      isPendingState: false,
      answersCount: 0,
      canAnswer: false,
      notificationSent: false,
      remainingTime: "",
    };
  }

  const isWriter = inquiry.author.user_id === currentUserId;
  const isAdmin = userRole === "admin";
  const isAssignee = inquiry.assignees.some(a => a.user_id === currentUserId);

  const internalState: InquiryState =
    STATUS_MAPPING[inquiry.status] || "PENDING";
  const finalStateLabel = INQUIRY_STATE_LABELS[internalState];
  const finalStatusConfig = INQUIRY_STATE_STYLES[finalStateLabel];

  return {
    isAssigneeEditMode:
      isAssignee && !["답변 완료", "등록 보류"].includes(finalStateLabel),
    permissions: {
      canEditAssignees: isAdmin || (isWriter && inquiry.assignees.length === 0),
      showAssigneeFeatures:
        isAssignee && !["답변 완료", "등록 보류"].includes(finalStateLabel),
    },
    isWriter,
    isAdmin,
    finalStateLabel,
    finalStatusConfig,
    isPendingState: finalStateLabel === "등록 보류",
    answersCount: inquiry.answers.count,
    canAnswer: inquiry.can_answer,
    notificationSent: false,
    remainingTime: "4:00",
  };
};
