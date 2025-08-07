/**
 * POST /api/scrap/{inquiry_id}
 */
export interface PostScrapResponse {
  scrap_id: number;
  inquiry_id: number;
  user_id: number;
  created_at: string;
}

/**
 * DELETE /api/scrap/{inquiry_id}
 */
export interface DeleteScrapResponse {
  scrap_id: number;
  inquiry_id: number;
  user_id: number;
  created_at: string; // 삭제 일시
}
