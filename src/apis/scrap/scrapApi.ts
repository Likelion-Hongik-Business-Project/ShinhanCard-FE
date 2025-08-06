import { ApiResponse } from "@/types/apiResponse.type";
import { PostScrapResponse } from "@/types/scrap/scrapApi.type";

import instance from "@/apis/instance";

// 스크랩 추가
export const postScrapInquiry = async (
  inquiryId: number
): ApiResponse<PostScrapResponse> => {
  const response = await instance.post(`/api/scrap/${inquiryId}`);
  return response.data;
};

// 스크랩 취소
export const deleteScrapInquiry = async (
  inquiryId: number
): ApiResponse<PostScrapResponse> => {
  const response = await instance.delete(`/api/scrap/${inquiryId}`);
  return response.data;
};
