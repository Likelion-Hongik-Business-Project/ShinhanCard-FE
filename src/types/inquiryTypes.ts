import { InquiryFile, UploadFile } from "./file/file.type";

export type UserRole = "default" | "assignee" | "writer" | "admin";

// 답변 타입
export interface Comment {
  answer_id: number;
  user: {
    user_id: number;
    username: string;
    profile_url?: string;
    team_name?: string;
  };
  content: string;
  created_at: string;
  updated_at: string;
  can_delete: boolean;
  files: InquiryFile[];
}

// 추가문의 타입
export interface FollowUp {
  follow_up_id: number;
  content: string;
  created_at: string;
  author: {
    user_id: number;
    user_name: string;
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
  onDelete: () => void;
}

// InquiryContent Props 타입
export interface InquiryContentProps {
  title: string;
  content: string;
  author: {
    user_id: number;
    user_name: string;
    profile_image_url?: string;
    team_name: string;
  };
  files?: InquiryFile[];
  createdAt: string;
  isWriter: boolean;
  isAdmin: boolean;
  answersCount: number;
  inquiryId: number;
  teamId: number;
  onDelete: () => void;
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
  inquiry: InquiryData;
  onToggleNotification: () => void;
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
    user_name: string;
    profile_image_url?: string;
    is_checked: boolean;
  }>;
  observers?: Array<{
    userId: number;
    userName: string;
    profileImageUrl?: string;
  }>;
  confirmedAssignees?: Array<{
    user_id: number;
    username: string;
    profile_image_url?: string;
  }>;
  isPendingState: boolean;
  isEditingAssignees?: boolean;
  allUsers?: import("@/types/team/user.type").AssigneeUser[];
  onAssigneeChange?: (newAssigneeIds: number[]) => void;
  onObserverChange?: (newObserverIds: number[]) => void;
  tempAssigneeIds?: number[];
  tempObserverIds?: number[];
  currentUserId?: number;
}

// AssigneeActionsProps 타입
export interface AssigneeActionsProps {
  showAssigneeFeatures: boolean;
  onStartAnswer: (commentToEdit?: Comment) => void;
  onConfirm: () => void;
  isCurrentUserConfirmed: boolean;
  showEditor: boolean;
  hasMyComment: boolean;
  inquiryId: number;
  teamId: number;
  isEditingAssignees?: boolean;
  onStartEditAssignees?: () => void;
  onCompleteEditAssignees?: () => void;
}

// 통합된 문의 타입
export interface InquiryData {
  inquiry_id: number;
  title: string;
  content: string;
  created_at: string;
  status: string;
  is_notification_enabled: boolean;
  author: {
    user_id: number;
    user_name: string;
    profile_image_url?: string;
    team_name: string;
  };
  assignees: Array<{
    user_id: number;
    user_name: string;
    profile_image_url?: string;
    is_checked: boolean;
  }>;
  observers: Array<{
    userId: number;
    userName: string;
    profileImageUrl?: string;
  }>;
  files: InquiryFile[];
  group: {
    group_id: number;
    group_name: string;
    active: boolean;
  };
  division: {
    division_id: number;
    division_name: string;
    active: boolean;
  };
  team: {
    team_id: number;
    team_name: string;
    active: boolean;
  };
  role: string;
  can_edit: boolean;
  can_answer: boolean;
  can_notify: boolean;
  is_scrapped: boolean;
  confirmed_assignees_count: number;
  confirmed_assignees: Array<{
    user_id: number;
    username: string;
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
  teamId: number;
  userRole?: UserRole;
  currentUserId?: number;
  handleStartAnswer: (commentToEdit?: Comment) => void;
  onConfirm: () => void;
  handleDeleteInquiry: () => void;
  handleNotify: () => void;
  remainingTime: string;
  notificationSent: boolean;
  showEditor: boolean;
  myComment?: Comment;
  onToggleNotification: () => void;
}

// AnswerListProps 타입
export interface AnswerListProps {
  answerers: {
    user_id: number;
    username: string;
    profile_image_url?: string;
  }[];
  selectedUserId: number | null;
  onSelectUser: (id: number) => void;
}

// AnswerItemProps 타입
export interface AnswerItemProps {
  comment: Comment;
  isOnlyComment: boolean;
  currentUserId?: number;
  onStartEdit: (comment: Comment) => void;
  onDelete: (answerId: number) => void;
}

// AnswerEditorProps 타입
export interface AnswerEditorProps {
  mode: "create" | "edit";
  initialContent: string;
  onContentChange: (content: string) => void;
  onSubmit: (content: string, fileIds: number[]) => void;
  fileIds: number[];
  files: UploadFile[];
  setFileIds: React.Dispatch<React.SetStateAction<number[]>>;
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}

// AnswerSectionProps 타입
export interface AnswerSectionProps {
  inquiry: InquiryData;
  currentUserId?: number;
  showEditor: boolean;
  tabsToDisplay: {
    user_id: number;
    username: string;
    profile_image_url?: string;
  }[];
  selectedUserId: number | null;
  selectedComment: Comment | null;
  draftContent: string;
  setDraftContent: (content: string) => void;
  handleStartAnswer: (commentToEdit?: Comment) => void;
  handleSelectTab: (userId: number) => void;
  onEditorSubmit: (content: string, fileIds: number[]) => void;
  onDeleteAnswer: (answerId: number) => void;
  editingComment: Comment | null;
  isWritingAnswer: boolean;
  selectedFileIds: number[];
  setSelectedFileIds: React.Dispatch<React.SetStateAction<number[]>>;
  isEditMode: boolean;
}

// NotificationButton Props 타입
export interface NotificationButtonProps {
  isWriter: boolean;
  notificationSent: boolean;
  remainingTime: string;
  finalStateLabel: string;
  onSend: () => void;
}

// 담당자 선택 컴포넌트에서 사용할 User 타입
export interface User {
  id: number;
  user_name: string;
  profile_image_url?: string;
}
