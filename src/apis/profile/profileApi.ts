import { ApiResponse } from "@/types/common/api.type";
import { ProfileData } from "@/types/profile/profile.type";
import { MOCK_PROFILE_DATA } from "@/mocks/profile/profileData";

import instance from "@/apis/instance";

export const getProfile = async (): Promise<ApiResponse<ProfileData>> => {
  try {
    const response =
      await instance.get<ApiResponse<ProfileData>>("/api/preview");
    return response.data;
  } catch (error) {
    // API 에러 시 Mock 데이터 사용
    console.log("프로필 API 에러, Mock 데이터 사용:", error);
    return {
      is_success: true,
      code: "COMMON200",
      message: "요청 처리 성공",
      result: MOCK_PROFILE_DATA,
    };
  }
};
