import { ApiResponse, GlobalResponse } from "@/types/common/api.type";
import {
  GetHomeInitialResponse,
  GetInterestedMembersResponse,
  GetUncheckedAnswerResponse,
  GetUncheckedInquiriesResponse,
} from "@/types/home/homeApi.type";

import instance from "@/apis/instance";

//홈페이지 초기 진입 API
export const getHomeInitial = async (): Promise<
  GlobalResponse<GetHomeInitialResponse>
> => {
  const response =
    await instance.get<GlobalResponse<GetHomeInitialResponse>>("/api/home");
  return response.data;
};

// 미확인 답변 조회 API
export const getUncheckedAnswer = async (
  teamId: number
): Promise<GlobalResponse<GetUncheckedAnswerResponse>> => {
  const response = await instance.get<
    GlobalResponse<GetUncheckedAnswerResponse>
  >(`/api/home/unchecked/answer/${teamId}`);
  return response.data;
};

// 미확인 문의 조회 API
export const getUncheckedInquiries = async (
  teamId: number
): Promise<GlobalResponse<GetUncheckedInquiriesResponse>> => {
  const response = await instance.get<
    GlobalResponse<GetUncheckedInquiriesResponse>
  >(`/api/home/unchecked/inquiries/${teamId}`);
  return response.data;
};

// ===== 관심 팀원 관련 API =====

// 관심 팀원 조회 API
export const getInterestedMembers = async (): Promise<
  GlobalResponse<GetInterestedMembersResponse>
> => {
  const response = await instance.get<
    GlobalResponse<GetInterestedMembersResponse>
  >("/api/home/interested");
  return response.data;
};

// 관심 팀원 추가
export const postAddInterestedMember = async (
  userId: number
): Promise<ApiResponse<Record<string, never>>> => {
  const response = await instance.post<ApiResponse<Record<string, never>>>(
    `/api/home/interested/${userId}`
  );
  return response.data;
};

// 관심 팀원 삭제
export const deleteRemoveInterestedMember = async (
  userId: number
): Promise<ApiResponse<Record<string, never>>> => {
  const response = await instance.delete<ApiResponse<Record<string, never>>>(
    `/api/home/interested/${userId}`
  );
  return response.data;
};
