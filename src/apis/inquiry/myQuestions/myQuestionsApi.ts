import { ApiResponse } from "@/types/apiResponse.type";
import {
  GetInitMyInquiryListResponse,
  GetMyInquiryListByTeamResponse,
} from "@/types/inquiry/inquiryListApi.type";
import {
  GetUserSpaceInitialResult,
  GetUserSpaceTeamResult,
} from "@/types/userSpace/userSpaceApi.type";

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

// 타인 스페이스 - 진입 시 초기 조회
export const getInitialUserSpaceResponse = async (
  user_id: number,
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetUserSpaceInitialResult> => {
  const response = await instance.get(`/api/inquiries/${user_id}/submitted`, {
    params: { page, status, date },
  });
  return response.data;
};

// 타인 스페이스 - written 탭 팀별 조회
export const getMyQuestionsInquiriesByUserIdAndTeam = async (
  user_id: number,
  team_id: number,
  page = 1,
  status?: string,
  date?: string
): ApiResponse<GetUserSpaceTeamResult> => {
  const response = await instance.get(
    `/api/inquiries/${user_id}/submitted/${team_id}`,
    {
      params: { page, status, date },
    }
  );
  return response.data;
};
