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

export interface PutInquiryRequest {
  title: string;
  content: string;
  assignee_ids: number[];
  observer_ids: number[];
}

export interface PutInquiryResponse {
  inquiry_id: number;
  updated_at: string;
}

export interface DeleteInquiryResponse {
  status: string;
  deleted_at: string;
}
