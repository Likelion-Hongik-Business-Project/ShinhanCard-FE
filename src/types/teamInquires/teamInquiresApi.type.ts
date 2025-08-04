export interface GetTeamInquiresRequest {
  team_id?: number;
  page?: number;
  status?: string;
  date?: DateFilter[];
}

export interface GetTeamInquiresResponse {
  selected_team: SelectedTeam;
  inquiries: Inquiry[];
  pagination: TPagination;
}

// 아래 전부 공용으로 빼고 싶어요...
// 선택된 팀 타입
export interface SelectedTeam {
  team_id: number;
  group_name: string;
  division_name: string;
  team_name: string;
}

// 날짜 필터
export interface DateFilter {
  year: number;
  month: number;
}

// 팀 게시판과 검색 결과에 사용되는 문의 타입
export interface Inquiry {
  inquiry_id: number;
  writer: Writer;
  title: string;
  content_preview: string;
  status?: InquiryStatus;
  created_at: string;
  is_scrapped: boolean;

  group_name?: string;
  division_name?: string;
  team_name?: string;
}

// 작성자
export interface Writer {
  user_id: number;
  name: string;
  profile_image_url: string;
}

// 상태 Enum
export type InquiryStatus = string;

// 페이지네이션
export interface TPagination {
  page: number;
  page_size: number;
  total: number;
  has_next: boolean;
}
