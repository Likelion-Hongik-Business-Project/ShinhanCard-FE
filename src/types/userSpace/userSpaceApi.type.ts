// export interface ProfilePreviewResponse {
//   id: number;
//   name: string;
//   team_id: number;
//   team_name: string;
//   group_name: string;
//   division_name: string;
//   email: string;
//   phone_number: string;
//   profile_image_url: string;
// }

// export interface InquiryItem {
//   id: number;
//   title: string;
//   writer: {
//     user_id: number;
//     name: string;
//   };
// }

// export interface InquiryListResponse {
//   inquiries: InquiryItem[];
//   selected_team: {
//     team_id: number;
//     team_name: string;
//   };
//   pagination: {
//     page_size: number;
//   };
// }

// export interface ScrapInquiryResponse extends InquiryListResponse {}

// export interface ApiResponse<T> {
//   is_success: boolean;
//   code: string;
//   message: string;
//   result: T;
// }

// types/userSpace/userSpaceApi.type.ts

export interface ProfilePreviewResponse {
  id: number;
  name: string;
  team_id: number;
  team_name: string;
  group_name: string;
  division_name: string;
  email: string;
  phone_number: string;
  profile_image_url: string;
}

export interface InquiryItem {
  id: number;
  title: string;
  writer: {
    user_id: number;
    name: string;
  };
}

export interface InquiryListResponse {
  inquiries: InquiryItem[];
  selected_team: {
    team_id: number;
    team_name: string;
  };
  pagination: {
    page_size: number;
  };
}

// ✅ 방법 1 (권장): 삭제하고 대신 InquiryListResponse 직접 사용
// export interface ScrapInquiryResponse extends InquiryListResponse {}

// ✅ 방법 2 (대안): type 별칭으로 정의
export type ScrapInquiryResponse = InquiryListResponse;

export interface ApiResponse<T> {
  is_success: boolean;
  code: string;
  message: string;
  result: T;
}
