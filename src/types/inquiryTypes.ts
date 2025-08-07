export type UserRole = "default" | "assignee" | "writer" | "admin";

// 답변 타입
export interface Comment {
  comment_id: number;
  // [수정] 'writer'를 'author'로, 'name'을 'username'으로 통일
  author: {
    user_id: number;
    username: string;
    profile_image_url?: string;
    team_name?: string;
  };
  content: string;
  created_at: string;
  can_delete: boolean;
}

// 추가문의 타입
export interface FollowUp {
  follow_up_id: number;
  content: string;
  created_at: string;
  author: {
    user_id: number;
    username: string;
    profile_image_url?: string;
  };
  comments: Comment[];
}

// Header Props 타입
export interface HeaderProps {
  isTeamEnd?: boolean;
  isAdmin?: boolean;
  teamInfo: {
    group_name: string;
    division_name: string;
    team_name: string;
  };
}

// InquiryContent Props 타입
export interface InquiryContentProps {
  title: string;
  content: string;
  author: {
    user_id: number;
    username: string;
    profile_image_url?: string;
    teamname: string;
  };
  createdAt: string;
  isWriter: boolean;
  isAdmin: boolean;
  answersCount: number;
}

// InquiryHeader Props 타입
export interface InquiryHeaderProps {
  finalStateLabel: string;
  finalStatusConfig: {
    bg: string;
    text: string;
    dot: string;
    border?: string;
  };
  isWriter: boolean;
  isAdmin: boolean;
  canSendNotification: boolean;
  inquiry: InquiryData;
}

// NotificationButton Props 타입
export interface NotificationButtonProps {
  isWriter: boolean;
  notificationSent: boolean;
  remainingTime: string;
  finalStateLabel: string;
}

// PendingActions Props 타입
export interface PendingActionsProps {
  isWriter: boolean;
  isPendingState: boolean;
}

// AssigneeSection Props 타입
export interface AssigneeSectionProps {
  assignees?: Array<{
    user_id: number;
    username: string; // [수정] 'name'을 'username'으로 통일
    profile_image_url?: string;
    is_confirmed: boolean;
  }>;
  // [수정] 'references'를 실제 데이터 키인 'observers'로 변경
  observers?: Array<{
    user_id: number;
    username: string; // [수정] 'name'을 'username'으로 통일
    profile_image_url?: string;
  }>;
  confirmedAssignees?: Array<{
    user_id: number;
    username: string; // [수정] 'name'을 'username'으로 통일
    profile_image_url?: string;
  }>;
  isPendingState: boolean;
  isAssigneeEditMode: boolean;
  showAssigneeFeatures: boolean;
}

// 통합된 문의 타입 (API 스펙에 완전히 맞춤)
export interface InquiryData {
  inquiry_id: number;
  title: string;
  content: string;
  created_at: string;
  inquiry_state: string;
  author: {
    user_id: number;
    username: string;
    profile_image_url?: string;
    teamname: string;
  };
  assignees: Array<{
    user_id: number;
    username: string;
    profile_image_url?: string;
    is_confirmed: boolean;
  }>;
  // [수정] 'references'를 실제 데이터 키인 'observers'로 변경
  observers: Array<{
    user_id: number;
    username: string; // [수정] 'name'을 'username'으로 통일
    profile_image_url?: string;
  }>;
  files: Array<{
    file_name: string;
    file_url: string;
  }>;
  group: {
    groupId: number;
    groupName: string;
    active: boolean;
  };
  division: {
    divisionId: number;
    divisionName: string;
    active: boolean;
  };
  team: {
    teamId: number;
    teamName: string;
    active: boolean;
  };
  can_edit: boolean;
  can_answer: boolean;
  can_notify: boolean;
  is_scraped: boolean;
  confirmed_assignees_count: number;
  confirmed_assignees: Array<{
    user_id: number;
    username: string; // [수정] 'name'을 'username'으로 통일
    profile_image_url?: string;
  }>;
  answers: {
    count: number;
    answers: Comment[];
  };
  follow_ups: FollowUp[];

  // 테스트용 필드들 (mock 데이터에서만 사용, 컴포넌트에서는 옵셔널)
  test_scenario?: string;
  test_user_role?: "default" | "assignee" | "writer" | "admin";
  test_current_user_id?: number;
}

// InquiryCard 컴포넌트 Props
export interface InquiryCardProps {
  inquiry: InquiryData;
  userRole?: UserRole;
  currentUserId?: number;
}
