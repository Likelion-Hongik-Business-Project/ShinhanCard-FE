export type UserRole = "default" | "assignee" | "writer" | "admin";

// 각 사용자 역할에 따른 권한
export const USER_ROLE_PERMISSIONS = {
  default: {
    // 기본 사용자 권한
    canView: true, // 게시글을 볼 수 있는 권한
    canScrap: true, // 게시글을 스크랩할 수 있는 권한
    showAssigneeFeatures: false, // 담당자 관련 기능 표시 여부
    showWriterFeatures: false, // 문의자 관련 기능 표시 여부
    showAdminFeatures: false, // 관리자 관련 기능 표시 여부
  },
  assignee: {
    // 담당자 권한
    canView: true, // 게시글을 볼 수 있는 권한
    canScrap: true, // 게시글을 스크랩할 수 있는 권한
    canAnswer: true, // 답변을 작성할 수 있는 권한
    canConfirm: true, // 게시글을 확인(확인 완료 처리)할 수 있는 권한
    canEditAssignees: true, // 담당자를 수정할 수 있는 권한
    showAssigneeFeatures: true, // 담당자 관련 기능 표시 여부
    showWriterFeatures: false, // 문의자 관련 기능 표시 여부
    showAdminFeatures: false, // 관리자 관련 기능 표시 여부
  },
  writer: {
    // 문의자 권한
    canView: true, // 게시글을 볼 수 있는 권한
    canScrap: true, // 게시글을 스크랩할 수 있는 권한
    canEdit: true, // 자신이 작성한 게시글을 수정할 수 있는 권한
    canDelete: true, // 자신이 작성한 게시글을 삭제할 수 있는 권한
    canSendNotification: true, // 담당자에게 알림을 발송할 수 있는 권한
    showAssigneeFeatures: false, // 담당자 관련 기능 표시 여부
    showWriterFeatures: true, // 문의자 관련 기능 표시 여부
    showAdminFeatures: false, // 관리자 관련 기능 표시 여부
  },
  admin: {
    // 관리자 권한
    canView: true, // 게시글을 볼 수 있는 권한
    canScrap: true, // 게시글을 스크랩할 수 있는 권한
    canDeleteAny: true, // 모든 게시글을 삭제할 수 있는 권한
    showAssigneeFeatures: false, // 담당자 관련 기능 표시 여부
    showWriterFeatures: false, // 문의자 관련 기능 표시 여부
    showAdminFeatures: true, // 관리자 관련 기능 표시 여부
  },
} as const;

export const NOTIFICATION_TIMER = {
  INITIAL_DELAY: 4 * 60 * 60 * 1000, // 문의 작성 후 첫 알림 발송까지 시간 (4시간)
  REPEAT_INTERVAL: 4 * 60 * 60 * 1000, // 첫 알림 이후 알림을 반복해서 발송할 수 있는 간격 (4시간)
} as const;
