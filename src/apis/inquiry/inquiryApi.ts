import { ApiResponse } from "@/types/apiResponse.type";
import {
  PostInquiryRequest,
  PostInquiryResponse,
} from "@/types/inquiry/inquiryApi.type";

import instance from "@/apis/instance";

export const postInquiry = async (
  team_id: number,
  data: PostInquiryRequest
): ApiResponse<PostInquiryResponse> => {
  const response = await instance.post(`/api/teams/${team_id}/inquiries`, data);
  return response.data;
};
