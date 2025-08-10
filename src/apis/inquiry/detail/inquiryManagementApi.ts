import {
  ApiResponse,
  GlobalResponse,
  NoResponse,
} from "@/types/apiResponse.type";
import {
  DeleteInquiryResponse,
  GetLastSentMailTimeResponse,
  PutInquiryAssigneeRequest,
  PutInquiryRequest,
  PutInquiryResponse,
} from "@/types/inquiry/inquiryManagementApi.type";

import axiosInstance from "@/apis/instance";

// PUT /api/teams/{team_id}/inquiries/{inquiry_id}/change-assignee
// 문의 담당자 변경
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

// POST /inquiries/{inquiry_id}/mails
// 알림 메일 수동 발송
export const postInquiryNotify = async (
  inquiry_id: number
): ApiResponse<string> => {
  const response = await axiosInstance.post<GlobalResponse<string>>(
    `/api/inquiries/${inquiry_id}/mails`
  );
  return response.data;
};

// DELETE /api/inquiries/{inquiry_id}
// 문의글 삭제
export const deleteInquiry = async (
  team_id: number,
  inquiry_id: number
): ApiResponse<DeleteInquiryResponse> => {
  const response = await axiosInstance.delete<
    GlobalResponse<DeleteInquiryResponse>
  >(`/api/teams/${team_id}/inquiries/${inquiry_id}`);
  return response.data;
};

// GET /api/inquiries/{inquiry_id}/mails/last-sent-time
// 마지막 메일 전송 시간을 조회합니다.
export const getLastSentMailTime = async (
  inquiry_id: number
): ApiResponse<GetLastSentMailTimeResponse> => {
  const response = await axiosInstance.get<
    GlobalResponse<GetLastSentMailTimeResponse>
  >(`/api/inquiries/${inquiry_id}/mails/last-sent-time`);
  return response.data;
};

// PUT /api/inquiries/{inquiry_id}
// 문의글 수정
export const putInquiry = async (
  inquiry_id: number,
  data: PutInquiryRequest
): ApiResponse<PutInquiryResponse> => {
  const response = await axiosInstance.put<GlobalResponse<PutInquiryResponse>>(
    `/api/inquiries/${inquiry_id}`,
    data
  );
  return response.data;
};
