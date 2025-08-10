import { ApiResponse } from "@/types/common/api.type";
import { ProfileData } from "@/types/profile/profile.type";

import instance from "@/apis/instance";

export const getProfile = async (): ApiResponse<ProfileData> => {
  const response = await instance.get("/api/profile/preview");
  return response.data;
};

// 타인의 프로필 정보 조회
export const getOtherProfile = async (id: number): ApiResponse<ProfileData> => {
  const response = await instance.get(`/api/profile/preview/${id}`);
  return response.data;
};
