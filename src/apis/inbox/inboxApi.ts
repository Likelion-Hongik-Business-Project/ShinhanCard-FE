import { ApiResponse } from "@/types/apiResponse.type";
import {
  GetNotificationsRequest,
  GetNotificationsResponse,
} from "@/types/inbox/inboxApi.type";

import instance from "@/apis/instance";

export const getNotifications = async ({
  page,
  page_size,
}: GetNotificationsRequest): ApiResponse<GetNotificationsResponse> => {
  const response = await instance.get("/api/notifications", {
    params: { page, page_size },
  });
  return response.data;
};
