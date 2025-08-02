import axios from "axios";

import { getAuthStore } from "@/store/getAuthStore";
import { useAuthStore } from "@/store/useAuthStore";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터
instance.interceptors.request.use(config => {
  const { accessToken } = getAuthStore();

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

// 응답 인터셉터: 401 (Unauthorized) 에러 시 처리
instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // 로그아웃 처리
      useAuthStore.getState().setLogout();

      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default instance;
