/**
 * PUT /api/teams/{team_id}/inquiries/{inquiry_id}/change-assignee
 */
export interface PutInquiryAssigneeRequest {
  assignee_ids: number[];
}

/**
 * DELETE /api/inquiries/{inquiry_id} (문의글 삭제)
 */
export interface DeleteInquiryResponse {
  status: string;
  deleted_at: string;
}

/**
 * GET /api/inquiries/{inquiry_id}/mails/last-sent-time (마지막 메일 전송시간 조회)
 */
export interface GetLastSentMailTimeResponse {
  inquiryId: number;
  lastSentTime: string;
}

/**
 * PUT /api/inquiries/{inquiry_id} (문의글 수정)
 */
export interface PutInquiryRequest {
  title: string;
  content: string;
  assignee_ids: number[];
  observer_ids: number[]; // API 명세서에는 reference_ids
}

export interface PutInquiryResponse {
  inquiry_id: number;
  updated_at: string;
}
