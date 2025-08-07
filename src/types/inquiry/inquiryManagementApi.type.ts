/**
 * PUT /api/teams/{team_id}/inquiries/{inquiry_id}/change-assignee
 */
export interface PutInquiryAssigneeRequest {
  assignee_ids: number[];
}
