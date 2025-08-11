import { ApiResponse, GlobalResponse } from "@/types/apiResponse.type";
import { GetMyProfileResponse } from "@/types/profile/profileApi.type";

import axiosInstance from "@/apis/instance";

// GET /api/profile/preview
// 내 프로필 정보 조회
export const getMyProfile = async (): ApiResponse<GetMyProfileResponse> => {
  const response = await axiosInstance.get<
    GlobalResponse<GetMyProfileResponse>
  >("/api/profile/preview");
  return response.data;
};
