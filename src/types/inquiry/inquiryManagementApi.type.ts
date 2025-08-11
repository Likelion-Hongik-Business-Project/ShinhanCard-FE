/**
 * PUT /api/teams/{team_id}/inquiries/{inquiry_id}/change-assignee
 */
export interface PutInquiryAssigneeRequest {
  assignee_ids: number[];
}

/**
 * GET /api/inquiries/{inquiry_id}/mails/last-sent-time (마지막 메일 전송시간 조회)
 */
export interface GetLastSentMailTimeResponse {
  inquiryId: number;
  lastSentTime: string;
}
