// 스크랩 결과 타입
export interface ScrapResult {
  scrap_id: number;
  inquiry_id: number;
  user_id: number;
  created_at: string;
}

// POST /api/scrap/{inquiry_id} 응답의 result 타입
export type PostScrapResponse = ScrapResult;

// DELETE /api/scrap/{inquiry_id} 응답의 result 타입
export type DeleteScrapResponse = ScrapResult;
