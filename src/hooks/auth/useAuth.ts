import axios from "axios";

import { ErrorResponse } from "@/types/common/api.type";
import { PostLoginRequest } from "@/types/login/loginApi.type";

import { useAuthApi } from "./useAuthApi";

import { useAuthStore } from "@/store/useAuthStore";

export const useAuth = () => {
  const { isLogin } = useAuthStore();
  const { postLoginMutation } = useAuthApi();

  const login = async ({ employeeId, password }: PostLoginRequest) => {
    try {
      await postLoginMutation.mutateAsync({ employeeId, password });
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        throw error.response?.data.code;
      }
    }
  };

  // TODO: logout

  // TODO: refresh

  return { isLogin, login };
};
