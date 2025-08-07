import { ApiResponse, GlobalResponse } from "@/types/apiResponse.type";
import { GetInquiryDetailResponse } from "@/types/inquiry/inquiryDetailApi.type";

import axiosInstance from "@/apis/instance";

/**
 * GET /api/teams/{team_id}/inquiries/{inquiry_id}
 * @description 문의글 상세 조회
 * @param {number} team_id
 * @param {number} inquiry_id
 * @returns {ApiResponse<GetInquiryDetailResponse>}
 */
export const getInquiryDetail = async (
  team_id: number,
  inquiry_id: number
): ApiResponse<GetInquiryDetailResponse> => {
  const response = await axiosInstance.get<
    GlobalResponse<GetInquiryDetailResponse>
  >(`/api/teams/${team_id}/inquiries/${inquiry_id}`);
  return response.data;
};
