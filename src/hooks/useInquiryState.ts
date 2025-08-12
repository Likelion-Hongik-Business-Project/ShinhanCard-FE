import {
  INQUIRY_STATE_LABELS,
  INQUIRY_STATE_STYLES,
  InquiryState,
  STATUS_MAPPING,
} from "@/constants/inquiryStates";
import { USER_ROLE_PERMISSIONS } from "@/constants/userRoles";
import { InquiryData, UserRole } from "@/types/inquiryTypes";

export const useInquiryState = (
  inquiry: InquiryData,
  userRole: UserRole,
  currentUserId?: number
) => {
  const permissions =
    USER_ROLE_PERMISSIONS[userRole] || USER_ROLE_PERMISSIONS["default"];
  const isWriter = inquiry.author.user_id === currentUserId;
  const isAdmin = inquiry.team_role === "TEAM_LEADER";

  const initialMappedState = (STATUS_MAPPING[inquiry.status] ||
    "BEFORE_CONFIRM") as InquiryState;

  // 실제 assignees 배열에서 확인된 담당자 수를 직접 계산
  const confirmedCount =
    inquiry.assignees?.filter(assignee => assignee.is_checked).length || 0;
  const totalAssignees = inquiry.assignees?.length || 0;
  const answersCount = inquiry.answers.count;

  // 최종 상태 라벨 계산
  let finalStateLabel = INQUIRY_STATE_LABELS[initialMappedState];
  if (initialMappedState === "BEFORE_CONFIRM" && totalAssignees > 0) {
    if (confirmedCount === totalAssignees) {
      finalStateLabel = answersCount > 0 ? "답변 완료" : "등록 보류";
    } else if (confirmedCount > 0) {
      finalStateLabel = "확인 중";
    }
  }

  const finalStatusConfig = INQUIRY_STATE_STYLES[finalStateLabel] || {
    bg: "bg-gray-200",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };

  return {
    permissions,
    isWriter,
    isAdmin,
    finalStateLabel,
    finalStatusConfig,
    answersCount,
    canSendNotification: inquiry.can_notify,
  };
};
