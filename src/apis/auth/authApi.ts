import { ApiResponse } from "@/types/common/apiResponse.type";
import {
  PostLoginRequest,
  PostLoginResponse,
  PostLogoutResponse,
} from "@/types/login/loginApi.type";

import instance from "@/apis/instance";

export const postLogin = async (
  data: PostLoginRequest
): ApiResponse<PostLoginResponse> => {
  const response = await instance.post("/api/users/login", data);
  return response.data;
};

// TODO : 추후 백엔드 로그아웃 API 추가 예정
export const postLogout = async (): Promise<
  ApiResponse<PostLogoutResponse>
> => {
  return {
    is_success: true,
    code: "COMMON200",
    message: "로그아웃 성공",
    result: { success: true },
  };
};

// TODO: postRefreshToken
