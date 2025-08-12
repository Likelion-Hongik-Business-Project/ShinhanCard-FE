import axios from "axios";

import { ErrorResponse } from "@/types/common/apiResponse.type";
import { PostLoginRequest } from "@/types/login/loginApi.type";

import { useAuthApi } from "./useAuthApi";

import { useAuthStore } from "@/store/useAuthStore";

export const useAuth = () => {
  const { isLogin } = useAuthStore();
  const { postLoginMutation, postLogoutMutation } = useAuthApi();

  const login = async ({ employeeId, password }: PostLoginRequest) => {
    try {
      await postLoginMutation.mutateAsync({ employeeId, password });
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        throw error.response?.data.code;
      }
    }
  };

  const logout = async () => {
    await postLogoutMutation.mutateAsync();
  };

  // TODO: refresh

  return { isLogin, login, logout };
};
