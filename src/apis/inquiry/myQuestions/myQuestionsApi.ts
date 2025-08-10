import { ApiResponse } from "@/types/apiResponse.type";
import {
  GetInitMyInquiryListResponse,
  GetMyInquiryListByTeamResponse,
} from "@/types/inquiry/inquiryListApi.type";

import instance from "@/apis/instance";

export const getInitMyQuestionsInquiries = async (
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetInitMyInquiryListResponse> => {
  const response = await instance.get("/api/inquiries/submitted", {
    params: { page, status, date },
  });
  return response.data;
};

export const getMyQuestionsInquiriesByTeam = async (
  teamId: number,
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetMyInquiryListByTeamResponse> => {
  const response = await instance.get(`/api/inquiries/submitted/${teamId}`, {
    params: { page, status, date },
  });
  return response.data;
};

export const getMyQuestionsInquiriesByUserId = async (
  user_id: number,
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetInitMyInquiryListResponse> => {
  const response = await instance.get(`/api/inquiries/${user_id}/submitted`, {
    params: { page, status, date },
  });
  return response.data;
};
