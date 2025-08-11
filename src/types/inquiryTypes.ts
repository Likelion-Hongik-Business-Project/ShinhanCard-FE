export type UserRole = "default" | "assignee" | "writer" | "admin";

// 답변 타입
export interface Comment {
  comment_id: number;
  writer: {
    user_id: number;
    name: string;
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
  writer: {
    user_id: number;
    name: string;
    profile_image_url?: string;
  };
  comments: Comment[];
}

export interface FollowUpList {
  count: number;
  follow_ups: FollowUp[];
}

// Header Props 타입
export interface HeaderProps {
  isTeamEnd?: boolean;
  isAdmin?: boolean;
  onDelete?: () => void;
}

// InquiryContent Props 타입
export interface InquiryContentProps {
  title: string;
  content: string;
  writer: {
    user_id: number;
    name: string;
    profile_image_url?: string;
    team_name: string;
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
    border?: string; // 등록 보류 상태에만 적용
  };
  isWriter: boolean;
  isAdmin: boolean;
  canSendNotification: boolean;
  isScrapped: boolean;
}

// NotificationButton Props 타입
export interface NotificationButtonProps {
  isWriter: boolean;
  notificationSent: boolean;
  remainingTime: string;
  finalStateLabel: string;
  onSend?: () => void;
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
    name: string;
    profile_image_url?: string;
    is_confirmed: boolean;
  }>;
  references?: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
  }>;
  confirmedAssignees?: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
  }>;
  isPendingState: boolean;
  isAssigneeEditMode: boolean;
  showAssigneeFeatures: boolean;
  confirmedUsers?: number[];
}

// AssigneeActions Props 타입
export interface AssigneeActionsProps {
  showAssigneeFeatures: boolean;
  onStartAnswer: () => void;
  onConfirm: () => void;
}

// 답변자 정보 타입
export interface Answerer {
  user_id: number;
  name: string;
  profile_image_url?: string;
}

// AnswerList Props 타입
export interface AnswerListProps {
  answerers: Answerer[];
  selectedUserId: number | null;
  onSelectUser: (id: number) => void;
}

// AnswerItem Props 타입
export interface AnswerItemProps {
  comment: Comment;
  isOnlyComment: boolean;
  currentUserId?: number;
  onStartEdit: (userId: number) => void;
}

// AnswerEditor Props 타입
export interface AnswerEditorProps {
  mode: "create" | "edit";
  initialContent: string;
  onContentChange: (content: string) => void;
  onSubmit: (content: string, files: File[]) => void;
}

// 통합된 문의 타입
export interface InquiryData {
  inquiry_id: number;
  title: string;
  content: string;
  created_at: string;
  inquiry_state: string;
  writer: {
    user_id: number;
    name: string;
    profile_image_url?: string;
    team_name: string;
  };
  assignees: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
    is_confirmed: boolean;
  }>;
  references: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
  }>;
  files: Array<{
    file_name: string;
    file_url: string;
  }>;
  can_edit: boolean;
  can_answer: boolean;
  can_notify: boolean;
  is_scrapped: boolean;
  confirmed_assignees_count: number;
  confirmed_assignees: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
  }>;
  comment_count: number;
  comments: Comment[];
  follow_ups: FollowUpList;

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
  confirmedUsers?: number[];
}

// AnswerSection 컴포넌트 Props
export interface AnswerSectionProps {
  inquiry: InquiryData;
  currentUserId: number;
  isEditing: boolean;
  selectedUserId: number | null;
  draftContent: string;
  tabsToDisplay: Answerer[];
  selectedComment: Comment | undefined;
  showEditor: boolean;
  myComment: Comment | undefined;
  setDraftContent: (content: string) => void;
  handleStartAnswer: () => void;
  handleSelectTab: (id: number) => void;
  handleSubmit: (content: string) => void;
  onEditorSubmit: (content: string, files: File[]) => void;
}
