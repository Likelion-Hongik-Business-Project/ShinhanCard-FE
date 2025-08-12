import { ApiResponse } from "@/types/common/apiResponse.type";
import { GetInquiriesResponse } from "@/types/inquiry/inquiryListApi.type";
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

export const getInitScrapInquiries = async (
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetInquiriesResponse> => {
  const response = await instance.get("/api/scrap/my", {
    params: { page, status, date },
  });
  return response.data;
};

export const getScrapInquiriesByTeam = async (
  teamId: number,
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetInquiriesResponse> => {
  const response = await instance.get(`/api/scrap/my/${teamId}`, {
    params: { page, status, date },
  });
  return response.data;
};
