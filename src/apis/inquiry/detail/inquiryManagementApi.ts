import {
  ApiResponse,
  GlobalResponse,
  NoResponse,
} from "@/types/apiResponse.type";
import { PutInquiryAssigneeRequest } from "@/types/inquiry/inquiryManagementApi.type";

import axiosInstance from "@/apis/instance";

/**
 * PUT /api/teams/{team_id}/inquiries/{inquiry_id}/change-assignee
 * @description 문의 담당자 수정
 */
export const putInquiryAssignee = async (
  team_id: number,
  inquiry_id: number,
  data: PutInquiryAssigneeRequest
): ApiResponse<NoResponse> => {
  const response = await axiosInstance.put<GlobalResponse<NoResponse>>(
    `/api/teams/${team_id}/inquiries/${inquiry_id}/change-assignee`,
    data
  );
  return response.data;
};

/**
 * POST /inquiries/{inquiry_id}/notify
 * @description 알림 메일 수동 발송
 */
export const postInquiryNotify = async (
  inquiry_id: number
): ApiResponse<string> => {
  const response = await axiosInstance.post<GlobalResponse<string>>(
    `/inquiries/${inquiry_id}/notify`
  );
  return response.data;
};
