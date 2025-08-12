import {
  ApiResponse,
  GlobalResponse,
  NoResponse,
} from "@/types/common/apiResponse.type";
import {
  GetLastSentMailTimeResponse,
  PutInquiryAssigneeRequest,
  PutInquiryObserverRequest,
} from "@/types/inquiry/inquiryManagementApi.type";

import instance from "@/apis/instance";

// PATCH /api/teams/{team_id}/inquiries/{inquiry_id}/change-assignee
// 문의 담당자 변경
export const putInquiryAssignee = async (
  team_id: number,
  inquiry_id: number,
  data: PutInquiryAssigneeRequest
): ApiResponse<NoResponse> => {
  const response = await instance.patch<GlobalResponse<NoResponse>>( // PUT → PATCH
    `/api/teams/${team_id}/inquiries/${inquiry_id}/change-assignee`,
    data
  );
  return response.data;
};

// PATCH /api/teams/{team_id}/inquiries/{inquiry_id}/change-observer
// 문의 참조자 변경
export const putInquiryObserver = async (
  team_id: number,
  inquiry_id: number,
  data: PutInquiryObserverRequest
): ApiResponse<NoResponse> => {
  const response = await instance.patch<GlobalResponse<NoResponse>>(
    `/api/teams/${team_id}/inquiries/${inquiry_id}/change-observer`,
    data
  );
  return response.data;
};

// POST /inquiries/{inquiry_id}/mails
// 알림 메일 수동 발송
export const postInquiryNotify = async (
  inquiry_id: number
): ApiResponse<string> => {
  const response = await instance.post<GlobalResponse<string>>(
    `/api/inquiries/${inquiry_id}/mails`
  );
  return response.data;
};

// GET /api/inquiries/{inquiry_id}/mails/last-sent-time
// 마지막 메일 전송 시간을 조회합니다.
export const getLastSentMailTime = async (
  inquiry_id: number
): ApiResponse<GetLastSentMailTimeResponse> => {
  const response = await instance.get<
    GlobalResponse<GetLastSentMailTimeResponse>
  >(`/api/inquiries/${inquiry_id}/mails/last-sent-time`);
  return response.data;
};

// PUT /api/teams/{team_id}/inquiries/{inquiry_id}/notification
// 개인 알림 설정 변경
export const putInquiryNotificationSetting = async (
  team_id: number,
  inquiry_id: number,
  data: { is_notification_enabled: boolean }
): ApiResponse<NoResponse> => {
  const response = await instance.put<GlobalResponse<NoResponse>>(
    `/api/teams/${team_id}/inquiries/${inquiry_id}/notification`,
    data
  );
  return response.data;
};
