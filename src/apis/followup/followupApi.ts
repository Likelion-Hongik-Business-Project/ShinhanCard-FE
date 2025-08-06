import { ApiResponse } from "@/types/apiResponse.type";
import {
  PostFollowupsRequest,
  PostFollowupsResponse,
  PutFollowupsRequest,
  PutFollowupsResponse,
} from "@/types/followup/followupApi";

import instance from "@/apis/instance";

export const postFollowups = async (
  inquiryId: number,
  data: PostFollowupsRequest
): ApiResponse<PostFollowupsResponse> => {
  const response = await instance.post(
    `/api/inquiries/${inquiryId}/followups`,
    data
  );
  return response.data;
};

export const putFollowups = async (
  inquiryId: number,
  followupId: number,
  data: PutFollowupsRequest
): ApiResponse<PutFollowupsResponse> => {
  const response = await instance.put(
    `/api/inquiries/${inquiryId}/followups/${followupId}`,
    data
  );
  return response.data;
};
