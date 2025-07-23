import { LoginResponse } from "@/types/auth";

export const MOCK_LOGIN_RESPONSE: LoginResponse = {
  is_success: true,
  message: "로그인 성공",
  code: 200,
  result: {
    access_token: "mock_access_token_abc123",
    refresh_token: "mock_refresh_token_xyz456",
  },
};

export const MOCK_LOGIN_FAILURE_RESPONSE: LoginResponse = {
  is_success: false,
  message: "아이디 또는 비밀번호가 올바르지 않습니다.",
  code: 401,
  result: null,
};
