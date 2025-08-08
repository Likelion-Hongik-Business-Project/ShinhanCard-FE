import { ApiResponse } from "@/types/apiResponse.type";
import {
  GetNotificationsRequest,
  GetNotificationsResponse,
  PatchArchiveNotificationRequest,
  PatchArchiveNotificationResponse,
  PatchReadNotificationRequest,
  PatchReadNotificationResponse,
} from "@/types/inbox/inboxApi.type";

import instance from "@/apis/instance";

// 수신함 조회
export const getNotifications = async ({
  page,
  page_size,
}: GetNotificationsRequest): ApiResponse<GetNotificationsResponse> => {
  const response = await instance.get("/api/notifications", {
    params: { page, page_size },
  });
  return response.data;
};

// 보관함 조회
export const getArchivedNotifications = async ({
  page,
  page_size,
}: GetNotificationsRequest): ApiResponse<GetNotificationsResponse> => {
  const { data } = await instance.get<ApiResponse<GetNotificationsResponse>>(
    "/api/notifications/archive",
    { params: { page, page_size } }
  );
  return data;
};

// 보관 상태 변경
export const patchArchiveNotification = async ({
  notification_id,
  is_archived,
}: PatchArchiveNotificationRequest): ApiResponse<PatchArchiveNotificationResponse> => {
  const { data } = await instance.patch<
    ApiResponse<PatchArchiveNotificationResponse>
  >(`/api/notifications/${notification_id}/archive`, { is_archived });
  console.log("변경", data);
  return data;
};

// 읽음 상태 변경
export const patchReadNotification = async ({
  notification_id,
  is_read,
}: PatchReadNotificationRequest): ApiResponse<PatchReadNotificationResponse> => {
  const { data } = await instance.patch<
    ApiResponse<PatchReadNotificationResponse>
  >(`/api/notifications/${notification_id}/read`, { is_read });
  return data;
};
