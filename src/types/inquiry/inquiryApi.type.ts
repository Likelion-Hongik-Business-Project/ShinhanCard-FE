export interface PostInquiryRequest {
  title: string;
  content: string;
  assignee_ids: number[];
  observer_ids: number[];
  file_ids: number[];
}

export interface PostInquiryResponse {
  inquiry_id: number;
  status: string;
}
