import { ApiResponse } from "@/types/common/api.type";
import { ProfileData } from "@/types/profile/profile.type";
import {
  MOCK_OTHER_PROFILE_DATA,
  MOCK_PROFILE_DATA,
} from "@/mocks/profile/profileData";

import instance from "@/apis/instance";

export const getProfile = async (): ApiResponse<ProfileData> => {
  try {
    const response = await instance.get("/api/profile/preview");
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

// 타인의 프로필 정보 조회
export const getOtherProfile = async (id: number): ApiResponse<ProfileData> => {
  try {
    const response = await instance.get(`/api/profile/preview/${id}`);
    return response.data;
  } catch (error) {
    // API 에러 시 Mock 데이터 사용
    console.log("타인 프로필 API 에러, Mock 데이터 사용:", error);
    return {
      is_success: true,
      code: "COMMON200",
      message: "요청 처리 성공",
      result: MOCK_OTHER_PROFILE_DATA,
    };
  }
};
