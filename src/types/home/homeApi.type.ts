// 공통 타입들
export interface TeamItem {
  team_id: number;
  group_name: string;
  division_name: string;
  team_name: string;
}

export interface SelectedTeam {
  team_id: number;
  group_name: string;
  division_name: string;
  team_name: string;
  active: boolean;
}

export interface Writer {
  id: number;
  name: string;
  profile_image_url: string;
}

// 문의 아이템 (writer 포함)
export interface InquiryItem {
  inquiry_id: number;
  writer: Writer;
  title: string;
  status: "DRAFT" | "UNCHECKED" | "IN_PROGRESS" | "COMPLETED";
  created_at: string;
  is_scraped: boolean;
}

// 미확인 답변용 InquiryItem (writer 정보 없음)
export interface InquiryItemWithoutWriter {
  inquiry_id: number;
  title: string;
  status: "DRAFT" | "UNCHECKED" | "IN_PROGRESS" | "COMPLETED";
  created_at: string;
  is_scraped: boolean;
}

export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  has_next: boolean;
}

// 1. 홈페이지 초기 진입 응답 타입
export interface GetHomeInitialResponse {
  total_unchecked_answer_count: number;
  total_unchecked_inquries_count: number;
  interest_count: number;
  writer: Writer;
  selected_team: SelectedTeam;
  unchecked_answer_teams: TeamItem[];
  unchecked_inquries_teams: TeamItem[];
  inquiries: InquiryItem[];
  pagination: Pagination;
}

// 2. 미확인 답변 조회 응답 타입 (writer 정보가 result 레벨에 있음)
export interface GetUncheckedAnswerResponse {
  writer: Writer;
  selected_team: SelectedTeam;
  inquiries: InquiryItemWithoutWriter[];
  pagination: Pagination;
}

// 3. 미확인 문의 조회 응답 타입 (각 inquiry에 writer 정보 있음)
export interface GetUncheckedInquiriesResponse {
  selected_team: SelectedTeam;
  inquiries: InquiryItem[];
  pagination: Pagination;
}

// 관심 팀원 관련 타입
export interface InterestedMember {
  name: string;
  member_id: number;
  group_name: string;
  division_name: string;
  team_name: string;
  profile_image_url: string;
}

// 4. 관심 팀원 조회 응답 타입
export interface GetInterestedMembersResponse {
  interest_count: number;
  interested_members: InterestedMember[];
}

// 요청 타입들
export interface GetUncheckedInquiriesRequest {
  team_id: number;
}

export interface GetUncheckedAnswerRequest {
  team_id: number;
}
