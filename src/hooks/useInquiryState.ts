import { useState } from "react";

import {
  INQUIRY_STATE_LABELS,
  INQUIRY_STATE_STYLES,
  InquiryState,
  STATUS_MAPPING,
} from "@/constants/inquiryStates";
import { USER_ROLE_PERMISSIONS, UserRole } from "@/constants/userRoles";
import { InquiryCardProps } from "@/types/inquiryTypes";

export const useInquiryState = (
  inquiry: InquiryCardProps["inquiry"],
  userRole: UserRole,
  currentUserId?: number
) => {
  // UI 상태 관리
  const [isAssigneeEditMode, setIsAssigneeEditMode] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [canSendNotification] = useState(true); // UI만 위해 기본값 설정

  // 권한 확인
  const permissions = USER_ROLE_PERMISSIONS[userRole];
  const isAssignee =
    userRole === "assignee" ||
    inquiry.assignees?.some(assignee => assignee.user_id === currentUserId);
  const isWriter =
    userRole === "writer" || inquiry.writer.user_id === currentUserId;
  const isAdmin = userRole === "admin";

  // 상태 매핑 및 계산
  const mappedState = (STATUS_MAPPING[inquiry.inquiry_state] ||
    "BEFORE_CONFIRM") as InquiryState;
  const stateLabel = INQUIRY_STATE_LABELS[mappedState];
  const statusConfig = INQUIRY_STATE_STYLES[stateLabel] || {
    bg: "bg-gray-200",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };

  // 등록 보류 상태 확인
  const confirmedCount = inquiry.confirmed_assignees?.length || 0;
  const totalAssignees = inquiry.assignees?.length || 0;
  const answersCount = inquiry.answers_count || 0;
  const isPendingState =
    confirmedCount === totalAssignees &&
    totalAssignees > 0 &&
    answersCount === 0;

  // 실제 표시될 상태
  const finalStateLabel = isPendingState ? "등록 보류" : stateLabel;
  const finalStatusConfig =
    INQUIRY_STATE_STYLES[finalStateLabel] || statusConfig;

  // 남은 시간 (UI용 더미 데이터)
  const remainingTime = notificationSent ? "(3:59:59)" : "";

  return {
    // UI 상태
    isAssigneeEditMode,
    setIsAssigneeEditMode,
    notificationSent,
    setNotificationSent,
    canSendNotification,
    remainingTime,

    // 권한
    permissions,
    isAssignee,
    isWriter,
    isAdmin,

    // 상태 정보
    finalStateLabel,
    finalStatusConfig,
    isPendingState,
    answersCount,
  };
};
