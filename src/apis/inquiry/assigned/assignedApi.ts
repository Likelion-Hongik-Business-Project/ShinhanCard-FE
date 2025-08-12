import { ApiResponse } from "@/types/apiResponse.type";
import { GetInquiriesResponse } from "@/types/inquiry/inquiryListApi.type";
import { GetUserSpaceAssignedResult } from "@/types/userSpace/userSpaceApi.type";

import instance from "@/apis/instance";

export const getInitAssignedInquiries = async (
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetInquiriesResponse> => {
  const response = await instance.get("/api/inquiries/assigned", {
    params: { page, status, date },
  });
  return response.data;
};

export const getAssignedInquiriesByTeam = async (
  teamId: number,
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetInquiriesResponse> => {
  const response = await instance.get(`/api/inquiries/assigned/${teamId}`, {
    params: { page, status, date },
  });
  return response.data;
};

// 타인 스페이스 - 담당 문의
export const getAssignedInquiriesByUserId = async (
  user_id: number,
  team_id: number,
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetUserSpaceAssignedResult> => {
  const response = await instance.get(
    `/api/inquiries/${user_id}/assigned/${team_id}`,
    {
      params: { page, status, date },
    }
  );
  return response.data;
};
