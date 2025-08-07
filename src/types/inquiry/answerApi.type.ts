/**
 * POST /api/inquiries/{inquiry_id}/answers
 */
export interface PostAnswerRequest {
  content: string;
  file_ids?: number[] | null;
}

export interface PostAnswerResponse {
  answer_id: number;
  status: "PUBLISHED";
  created_at: string;
}

/**
 * PUT /api/answers/{answer_id}
 */
export interface PutAnswerRequest {
  content: string;
  file_ids?: number[] | null;
}

export interface PutAnswerResponse {
  answer_id: number;
  updated_at: string;
}

/**
 * DELETE /api/answers/{answer_id}
 */
export interface DeleteAnswerResponse {
  message: string;
  deleted_at: string;
}
