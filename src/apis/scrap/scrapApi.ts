import { ApiResponse } from "@/types/apiResponse.type";
import type {
  DeleteScrapResponse,
  PostScrapResponse,
} from "@/types/scrap/scrapApi.type";

import instance from "@/apis/instance";

// 스크랩 등록
export const postScrap = async (
  inquiry_id: number
): Promise<ApiResponse<PostScrapResponse>> => {
  try {
    const response = await instance.post<ApiResponse<PostScrapResponse>>(
      `/api/scrap/${inquiry_id}`
    );
    return response.data;
  } catch (error) {
    console.error("스크랩 등록 실패:", error);
    throw error;
  }
};

// 스크랩 취소
export const deleteScrap = async (
  inquiry_id: number
): Promise<ApiResponse<DeleteScrapResponse>> => {
  try {
    const response = await instance.delete<ApiResponse<DeleteScrapResponse>>(
      `/api/scrap/${inquiry_id}`
    );
    return response.data;
  } catch (error) {
    console.error("스크랩 취소 실패:", error);
    throw error;
  }
};
