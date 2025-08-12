import {
  InquiryServerStatus,
  Pagination,
} from "@/types/inquiry/inquiryListApi.type";

export interface GetTeamInquiresRequest {
  team_id?: number;
  page?: number;
  status?: string;
  date?: string;
}

export interface GetTeamInquiresResponse {
  selected_team: SelectedTeam;
  inquiries: Inquiry[];
  pagination: Pagination;
}

// 선택된 팀 타입
export interface SelectedTeam {
  team_id: number;
  group_name: string;
  division_name: string;
  team_name: string;
  active: boolean;
}

// 팀 게시판과 검색 결과에 사용되는 문의 타입
export interface Inquiry {
  inquiry_id: number;
  writer: Writer;
  title: string;
  content_preview: string;
  status?: InquiryServerStatus;
  created_at: string;
  is_scrapped: boolean;
  group_name?: string;
  division_name?: string;
  team_name?: string;
  team_id?: number;
}

// 작성자
export interface Writer {
  user_id: number;
  name: string;
  profile_image_url: string;
}
