export interface InquiryResponse {
  inquiry_id: number;
  title: string;
  content: string;
  status: string; // 필요한 상태를 추가하세요
  role: string; // 필요한 역할을 추가하세요
  author: Author;
  assignees: Assignee[];
  observers: Observer[];
  group: Group;
  division: Division;
  team: Team;
  answers: AnswerSection;
  files: AttachedFile[];
  is_scraped: boolean;
  created_at: string;
  follow_ups: FollowUpSection;
}

export interface Author {
  username: string;
  teamname: string;
  user_id: number;
  profile_image_url: string;
}

export interface Assignee {
  user_name: string;
  is_checked: boolean;
  user_id: number;
  profile_image_url: string;
}

export interface Observer {
  userId: number;
  userName: string;
  profileImageUrl: string;
}

export interface Group {
  groupId: number;
  groupName: string;
  active: boolean;
}

export interface Division {
  divisionId: number;
  divisionName: string;
  active: boolean;
}

export interface Team {
  teamId: number;
  teamName: string;
  active: boolean;
}

export interface AnswerSection {
  count: number;
  answers: Answer[];
}

export interface Answer {
  content: string;
  user: AnswerUser;
  files: FileInfo[];
  created_at: string;
  is_selected: boolean;
}

export interface AnswerUser {
  username: string;
  profile_url: string;
  role: string;
  user_id: number;
}

export interface FileInfo {
  fileId: number;
  fileKey: string;
  fileName: string;
  fileSize: number;
}

export interface AttachedFile {
  fileId: number;
  fileKey: string;
  fileName: string;
  fileSize: number;
}

export interface FollowUpSection {
  count: number;
  follow_ups: FollowUp[];
}

export interface FollowUp {
  follow_up_id: number;
  content: string;
  author: FollowUpAuthor;
  comments: FollowUpComment[];
  tagged_user: TaggedUser;
  created_at: string;
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

export interface FollowUpComment {
  comment_id: number;
  author: FollowUpAuthor;
  content: string;
  created_at: string;
  tagged_user: TaggedUser;
}
