export interface InquiryResponse {
  inquiry_id: number;
  title: string;
  content: string; // Markdown, 이미지 URL 포함
  created_at: string; // ISO 포맷
  inquiry_state: InquiryState;
  writer: User;
  assignees: Assignee[];
  references: ReferenceUser[];
  files: AttachedFile[];
  can_edit: boolean;
  can_answer: boolean;
  can_notify: boolean;
  is_scrapped: boolean;
  confirmed_assignees_count: number;
  confirmed_assignees: ReferenceUser[];
  comment_count: number;
  comments: Comment[];
  follow_ups: FollowUp[];
}

export type InquiryState = "확인 전" | "확인 중" | "최종완료" | "등록 보류";

export interface User {
  user_id: number;
  name: string;
  profile_image_url: string;
}

export interface Assignee extends User {
  is_confirmed: boolean;
}

export type ReferenceUser = User;

export interface AttachedFile {
  file_name: string;
  file_url: string;
}

export interface Comment {
  comment_id: number;
  writer: User;
  content: string; // Markdown 지원 여부에 따라 변경 가능
  created_at: string; // ISO 포맷
  can_delete: boolean;
}

export interface FollowUp {
  follow_up_id: number;
  content: string; // Markdown
  created_at: string; // ISO 포맷
  writer: User;
  comments: FollowUpComment[];
}

export interface FollowUpComment {
  comment_id: number;
  content: string;
  created_at: string; // ISO 포맷
  writer: User;
  parent_comment_id: number | null;
}
