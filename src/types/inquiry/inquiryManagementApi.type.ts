/**
 * PUT /api/teams/{team_id}/inquiries/{inquiry_id}/change-assignee
 */
export interface PutInquiryAssigneeRequest {
  newAssignee_ids: number[];
}

/**
 * PATCH /api/teams/{team_id}/inquiries/{inquiry_id}/change-observer
 */
export interface PutInquiryObserverRequest {
  newObserver_ids: number[];
}

/**
 * PATCH /api/teams/{team_id}/inquiries/{inquiry_id}/reassign
 * 등록 보류된 문의글 담당자 재할당
 */
export interface PatchInquiryReassignRequest {
  newAssignee_ids: number[];
}

/**
 * GET /api/inquiries/{inquiry_id}/mails/last-sent-time (마지막 메일 전송시간 조회)
 */
export interface GetLastSentMailTimeResponse {
  inquiryId: number;
  lastSentTime: string;
}
