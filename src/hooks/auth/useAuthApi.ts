import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postLogin, postLogout } from "@/apis/auth/authApi";
import { useAuthStore } from "@/store/useAuthStore";

export const useAuthApi = () => {
  const login = useAuthStore(state => state.setLogin);
  const logout = useAuthStore(state => state.setLogout);
  const queryClient = useQueryClient();

  const postLoginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: res => {
      const { accessToken } = res.result;
      login({ accessToken: accessToken });
    },
  });

  const postLogoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      queryClient.clear();
      logout();
    },
  });

  // TODO: postRefreshTokenMutation

  return { postLoginMutation, postLogoutMutation };
};
