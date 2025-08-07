import { ApiResponse, GlobalResponse } from "@/types/apiResponse.type";
import {
  DeleteScrapResponse,
  PostScrapResponse,
} from "@/types/scrap/scrapApi.type";

import axiosInstance from "@/apis/instance";

/**
 * POST /api/scrap/{inquiry_id}
 * @description 스크랩 추가
 */
export const postScrap = async (
  inquiry_id: number
): ApiResponse<PostScrapResponse> => {
  const response = await axiosInstance.post<GlobalResponse<PostScrapResponse>>(
    `/api/scrap/${inquiry_id}`
  );
  return response.data;
};

/**
 * DELETE /api/scrap/{inquiry_id}
 * @description 스크랩 취소
 */
export const deleteScrap = async (
  inquiry_id: number
): ApiResponse<DeleteScrapResponse> => {
  const response = await axiosInstance.delete<
    GlobalResponse<DeleteScrapResponse>
  >(`/api/scrap/${inquiry_id}`);
  return response.data;
};
