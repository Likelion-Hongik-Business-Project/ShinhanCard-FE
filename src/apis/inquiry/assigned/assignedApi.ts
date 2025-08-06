import { ApiResponse } from "@/types/apiResponse.type";
import { GetInitAssignedInquiriesResponse } from "@/types/inquiry/inquiryListApi.type";

import instance from "@/apis/instance";

export const getInitAssignedInquiries = async (
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetInitAssignedInquiriesResponse> => {
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
): ApiResponse<GetInitAssignedInquiriesResponse> => {
  const response = await instance.get(`/api/inquiries/assigned/${teamId}`, {
    params: { page, status, date },
  });
  return response.data;
};
