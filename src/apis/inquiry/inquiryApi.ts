import { ApiResponse } from "@/types/apiResponse.type";
import {
  DeleteInquiryResponse,
  PostInquiryRequest,
  PostInquiryResponse,
  PutInquiryRequest,
  PutInquiryResponse,
} from "@/types/inquiry/inquiryApi.type";

import instance from "@/apis/instance";

export const postInquiry = async (
  team_id: number,
  data: PostInquiryRequest
): ApiResponse<PostInquiryResponse> => {
  const response = await instance.post(`/api/teams/${team_id}/inquiries`, data);
  return response.data;
};

export const putInquiry = async (
  team_id: number,
  inquiry_id: number,
  data: PutInquiryRequest
): ApiResponse<PutInquiryResponse> => {
  const response = await instance.put<ApiResponse<PutInquiryResponse>>(
    `/api/teams/${team_id}/inquiries/${inquiry_id}`,
    data
  );
  return response.data;
};

export const deleteInquiry = async (
  team_id: number,
  inquiry_id: number
): ApiResponse<DeleteInquiryResponse> => {
  const response = await instance.delete<ApiResponse<DeleteInquiryResponse>>(
    `/api/teams/${team_id}/inquiries/${inquiry_id}`
  );
  return response.data;
};
