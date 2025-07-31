import { useState } from "react";

import {
  INQUIRY_STATE_LABELS,
  INQUIRY_STATE_STYLES,
  InquiryState,
  STATUS_MAPPING,
} from "@/constants/inquiryStates";
import { USER_ROLE_PERMISSIONS, UserRole } from "@/constants/userRoles";
import { InquiryData } from "@/types/inquiryTypes";

export const useInquiryState = (
  inquiry: InquiryData,
  userRole: UserRole,
  currentUserId?: number
) => {
  // UI 상태 관리
  const [isAssigneeEditMode, setIsAssigneeEditMode] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  // API에서 제공하는 권한 사용 (우선순위)
  const canEdit = inquiry.can_edit;
  const canAnswer = inquiry.can_answer;  
  const canSendNotification = inquiry.can_notify;

  // 기본 권한 설정
  const permissions = USER_ROLE_PERMISSIONS[userRole];
  const isWriter = inquiry.writer.user_id === currentUserId;
  const isAdmin = userRole === "admin";

  // 상태 매핑 및 계산
  const mappedState = (STATUS_MAPPING[inquiry.inquiry_state] || "BEFORE_CONFIRM") as InquiryState;
  const stateLabel = INQUIRY_STATE_LABELS[mappedState];
  const statusConfig = INQUIRY_STATE_STYLES[stateLabel] || {
    bg: "bg-gray-200",
    text: "text-gray-600", 
    dot: "bg-gray-400",
  };

  // 등록 보류 상태 확인 - API 데이터 기준으로 단순화
  const confirmedCount = inquiry.confirmed_assignees_count;
  const totalAssignees = inquiry.assignees?.length || 0;
  const answersCount = inquiry.comment_count;
  const isPendingState = 
    confirmedCount === totalAssignees && 
    totalAssignees > 0 && 
    answersCount === 0;

  // 실제 표시될 상태
  const finalStateLabel = isPendingState ? "등록 보류" : stateLabel;
  const finalStatusConfig = INQUIRY_STATE_STYLES[finalStateLabel] || statusConfig;

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

    // API 권한
    canEdit,
    canAnswer,

    // 권한
    permissions,
    isWriter,
    isAdmin,

    // 상태 정보
    finalStateLabel,
    finalStatusConfig,
    isPendingState,
    answersCount,
  };
};