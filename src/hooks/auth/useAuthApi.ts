import { useMutation } from "@tanstack/react-query";

import { postLogin } from "@/apis/auth/authApi";
import { useAuthStore } from "@/store/useAuthStore";

export const useAuthApi = () => {
  const login = useAuthStore(state => state.setLogin);
  // const logout = useAuthStore(state => state.setLogout);

  const postLoginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: res => {
      const { accessToken } = res.result;
      login({ accessToken: accessToken });
    },
  });

  // TODO: postLogoutMutation

  // TODO: postRefreshTokenMutation

  return { postLoginMutation };
};
