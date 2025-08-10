import { ApiResponse } from "@/types/common/api.type";
import {
  GetHomeInitialResponse,
  GetInterestedMembersResponse,
  GetUncheckedAnswerResponse,
  GetUncheckedInquiriesResponse,
} from "@/types/home/homeApi.type";

import instance from "@/apis/instance";

//홈페이지 초기 진입 API
export const getHomeInitial = async (): ApiResponse<GetHomeInitialResponse> => {
  const response = await instance.get("/api/home");
  return response.data;
};

// 미확인 답변 조회 API
export const getUncheckedAnswer = async (
  teamId: number,
  page: number = 1
): ApiResponse<GetUncheckedAnswerResponse> => {
  const response = await instance.get(
    `/api/home/unchecked/answer/${teamId}?page=${page}`
  );
  return response.data;
};

// 미확인 문의 조회 API
export const getUncheckedInquiries = async (
  teamId: number,
  page: number = 1
): ApiResponse<GetUncheckedInquiriesResponse> => {
  const response = await instance.get(
    `/api/home/unchecked/inquiries/${teamId}?page=${page}`
  );
  return response.data;
};

// ===== 관심 팀원 관련 API =====

// 관심 팀원 조회 API
export const getInterestedMembers =
  async (): ApiResponse<GetInterestedMembersResponse> => {
    const response = await instance.get("/api/home/interested");
    return response.data;
  };

// 관심 팀원 추가
export const postAddInterestedMember = async (
  userId: number
): ApiResponse<Record<string, never>> => {
  const response = await instance.post(`/api/home/interested/${userId}`);
  return response.data;
};

// 관심 팀원 삭제
export const deleteRemoveInterestedMember = async (
  userId: number
): ApiResponse<Record<string, never>> => {
  const response = await instance.delete(`/api/home/interested/${userId}`);
  return response.data;
};
