import { ApiResponse } from "@/types/common/api.type";

import instance from "@/apis/instance";

// 관심 팀원 추가
export const addInterestedMember = async (
  userId: number
): Promise<ApiResponse<Record<string, never>>> => {
  const response = await instance.post<ApiResponse<Record<string, never>>>(
    `/api/home/interested/${userId}`
  );
  return response.data;
};

// 관심 팀원 삭제
export const removeInterestedMember = async (
  userId: number
): Promise<ApiResponse<Record<string, never>>> => {
  const response = await instance.delete<ApiResponse<Record<string, never>>>(
    `/api/home/interested/${userId}`
  );
  return response.data;
};
