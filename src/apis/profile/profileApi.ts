import { ApiResponse } from "@/types/common/apiResponse.type";
import { GetProfileResponse } from "@/types/profile/profileApi.type";

import instance from "@/apis/instance";

export const getMyProfile = async (): ApiResponse<GetProfileResponse> => {
  const response = await instance.get("/api/profile/preview");
  return response.data;
};

// 타인의 프로필 정보 조회
export const getOtherProfile = async (
  id: number
): ApiResponse<GetProfileResponse> => {
  const response = await instance.get(`/api/profile/preview/${id}`);
  return response.data;
};
