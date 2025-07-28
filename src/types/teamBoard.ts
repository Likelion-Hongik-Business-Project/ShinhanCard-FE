export type ISODateString = string; // "2025-07-23T12:34:56+09:00" 같은 형식

export interface TeamBoardResponse {
  team_id: number;
  group_name: string;
  division_name: string;
  team_name: string;
  inquiry_count: number;
  inquiries: Inquiry[];
  pagination: Pagination;
}

export interface Inquiry {
  inquiry_id: number;
  title: string;
  content_preview: string;
  inquiry_state: string; // 실제 상태값 enum 나오면 교체
  created_at: ISODateString;
  writer: Writer;
  is_scrapped: boolean;
}

export interface Writer {
  user_id: number;
  name: string;
  profile_image_url: string;
}

export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  has_next: boolean;
}
