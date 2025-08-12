// UserSpace(타인 스페이스) 전용 타입 정의

// 팀 정보
export interface UserSpaceTeamItem {
  team_id: number;
  group_name: string;
  division_name: string;
  team_name: string;
  active?: boolean; // 초기 selected_team에 존재
}

// 사용자(작성자/대상 사용자) 정보
// 초기 written 응답의 writer 형태 (간소한 프로필)
export interface UserSpaceWriter {
  id: number;
  name: string;
  profile_image_url: string | null;
}

// assigned/scrap 응답의 user 형태
export interface UserSpaceProfile {
  id: number;
  name: string;
  profile_image_url: string | null;
}

// 공통 페이지네이션 정보
export interface UserSpacePagination {
  page: number;
  page_size: number;
  total: number;
  has_next: boolean;
}

// written 탭 문의 아이템 (writer가 없음 - 상위 레벨 writer 사용)
export interface UserSpaceMyInquiryItem {
  inquiry_id: number;
  title: string;
  status: string;
  created_at: string;
  is_scrapped: boolean;
}

// assigned/scrap 탭 문의 아이템 (각 항목에 writer 포함)
export interface UserSpaceInquiryItem {
  inquiry_id: number;
  writer: {
    id: number;
    name: string;
    profile_image_url: string | null;
  };
  title: string;
  status: string;
  created_at: string;
  is_scrapped: boolean;
}

// 타인 스페이스 초기 데이터 (written 탭 기본)
export interface GetUserSpaceInitialResult {
  total_count: number;
  writer: UserSpaceWriter;
  selected_team: UserSpaceTeamItem;
  teams: UserSpaceTeamItem[];
  assigned_inquiry_teams: UserSpaceTeamItem[];
  scrapped_inquiry_teams: UserSpaceTeamItem[];
  inquiries: UserSpaceMyInquiryItem[]; // writer가 없는 문의 아이템
  pagination: UserSpacePagination;
}

// 타인 스페이스 팀별 조회 응답 (written 탭 팀 선택 시)
export interface GetUserSpaceTeamResult {
  total_count: number;
  writer: UserSpaceWriter;
  selected_team: UserSpaceTeamItem;
  inquiries: UserSpaceMyInquiryItem[]; // writer가 없는 문의 아이템
  pagination: UserSpacePagination;
}

// 타인 스페이스 - 담당 문의 응답(result)
export interface GetUserSpaceAssignedResult {
  total_count: number;
  user: UserSpaceProfile;
  selected_team: UserSpaceTeamItem;
  inquiries: UserSpaceInquiryItem[];
  pagination: UserSpacePagination;
}

// 타인 스페이스 - 스크랩 문의 응답(result)
export interface GetUserSpaceScrapResult {
  total_count: number;
  user: UserSpaceProfile;
  selected_team: UserSpaceTeamItem;
  inquiries: UserSpaceInquiryItem[];
  pagination: UserSpacePagination;
}
