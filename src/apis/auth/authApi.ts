import { ApiResponse } from "@/types/common/api.type";
import {
  PostLoginRequest,
  PostLoginResponse,
} from "@/types/login/loginApi.type";

import instance from "@/apis/instance";

export const postLogin = async (
  data: PostLoginRequest
): ApiResponse<PostLoginResponse> => {
  const response = await instance.post("/api/users/login", data);
  return response.data;
};

// TODO: postLogout

// TODO: postRefreshToken
