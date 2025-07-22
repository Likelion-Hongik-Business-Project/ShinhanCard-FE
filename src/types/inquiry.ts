export type InquiryStatus = "확인 전" | "확인 중" | "답변 완료";

export interface Profile {
  user_id: number;
  name: string;
  profile_image_url: string;
}

export interface TeamItem {
  team_id: number;
  group_name: string;
  division_name: string;
  team_name: string;
}

export interface InquiryPagination {
  page: number;
  page_size: number;
  total: number;
  has_next: boolean;
}

export interface AssignedInquiryItem {
  inquiry_id: number;
  writer: Profile;
  title: string;
  status: InquiryStatus;
  created_at: string;
  is_scraped: boolean;
}

export interface AssignedInquiryListResponse {
  total_count: number;
  selected_team: TeamItem;
  teams: TeamItem[];
  inquiries: AssignedInquiryItem[];
  pagination: InquiryPagination;
}

export interface InquiryListItem {
  id: number;
  team_id: number;
  leftProfiles: Profile[];
  title: string;
  status: InquiryStatus;
  created_at: string;
  is_scraped: boolean;
}
