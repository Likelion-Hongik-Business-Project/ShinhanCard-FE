import { ProfileData } from "@/types/profile/profile.type";

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

export interface FollowUpComment {
  comment_id: number;
  author: FollowUpAuthor;
  content: string;
  created_at: string;
  tagged_user: TaggedUser;
}

// 추가문의 타입
export interface FollowUp {
  follow_up_id: number;
  tagged_user: TaggedUser;
  content: string;
  created_at: string;
  author: FollowUpAuthor;
  comments: FollowUpComment[];
}

export interface FollowUpList {
  count: number;
  follow_ups: FollowUp[];
}

// Header Props 타입
export interface HeaderProps {
  isTeamEnd?: boolean;
  isAdmin?: boolean;
  teamInfo: {
    group_name: string;
    division_name: string;
    team_name: string;
    team_id: number;
  };
  onDelete: () => void;
  openAddMemberSidebar: (teamName: string, teamId: number) => void;
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
  isPendingState?: boolean; // 추가: 등록 보류 상태 여부
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

// 등록 보류 상태 문의자 액션 Props 타입 (새로 추가)
export interface PendingWriterActionsProps {
  isWriter: boolean;
  isPendingState: boolean;
  isAssigneeChanged: boolean; // 담당자가 변경되었는지 여부
  onCancelRegistration: () => void; // 등록 취소
  onSubmitInquiry: () => void; // 문의 등록하기
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
  isWriter?: boolean; // 추가: 문의자 여부
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
  // 등록 보류 상태 관련 props 추가
  isPendingState?: boolean;
  isWriter?: boolean;
  isAssigneeChanged?: boolean;
  onCancelRegistration?: () => void;
  onSubmitInquiry?: () => void;
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
  team_role: string;
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
  follow_ups: FollowUpList;

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
  currentUserId?: ProfileData | null;
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

//
export interface Assignee {
  user_id: number;
  user_name: string;
  profile_image_url?: string;
  is_checked: boolean;
}

export interface FollowUpAuthor {
  username: string;
  profile_url: string;
  role: string;
  user_id: number;
}

export interface TaggedUser {
  username: string;
  user_id: number;
}
