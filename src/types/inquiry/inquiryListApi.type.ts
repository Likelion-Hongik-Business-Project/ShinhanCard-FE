export type InquiryServerStatus =
  | "DRAFT"
  | "UNCHECKED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type InquiryStatus = "확인 전" | "확인 중" | "답변 완료";

export type GetInquiriesRequest = {
  page?: number;
  status?: string;
  date?: string;
};

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

// assigned
export interface AssignedInquiryItem {
  inquiry_id: number;
  writer: Profile;
  title: string;
  status: InquiryServerStatus;
  created_at: string;
  is_scraped: boolean;
}

export interface GetInquiriesResponse {
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

export type YearMonth = { year: number; month: number };

// my questions
export interface InquiryAssignee {
  id: number;
  name: string;
  profile_image_url: string;
}

export interface MyInquiryItem {
  inquiry_id: number;
  title: string;
  inquiry_assignees: InquiryAssignee[];
  status: InquiryServerStatus;
  created_at: string;
  is_scraped: boolean;
}

export interface MyInquiryListResponse {
  total_count: number;
  writer: {
    id: number;
    name: string;
    profile_image_url: string;
  };
  selected_team: TeamItem;
  teams: TeamItem[];
  inquiries: MyInquiryItem[];
  pagination: InquiryPagination;
}

// scrap
export interface ScrapedInquiryItem {
  inquiry_id: number;
  writer: Profile;
  title: string;
  status: InquiryServerStatus;
  created_at: string;
  is_scraped: boolean;
}

export interface ScrapedInquiryListResponse {
  total_count: number;
  selected_team: TeamItem;
  teams: TeamItem[];
  inquiries: ScrapedInquiryItem[];
  pagination: InquiryPagination;
}

export type TInquiryBase = {
  inquiry_id: number;
  title: string;
  status: InquiryServerStatus;
  created_at: string;
  is_scraped: boolean;
  writer?: Profile;
};
