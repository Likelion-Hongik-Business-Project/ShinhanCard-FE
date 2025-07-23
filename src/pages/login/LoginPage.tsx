import { useEffect, useState } from "react";

import logo from "@/assets/svgs/login/shinhanLogo_cut.png";
import IDInputField from "@/components/login/IDInputField";
import PasswordInputField from "@/components/login/PasswordInputField";

import "@/styles/globals.css";
import {
  MOCK_LOGIN_FAILURE_RESPONSE,
  MOCK_LOGIN_RESPONSE,
} from "@/mocks/auth/mockLoginResponse";

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [errorTypeID, setErrorTypeID] = useState<
    "invalid" | "notfound" | "none"
  >("none");
  const [errorTypePw, seterrorTypePw] = useState<"none" | "invalid">("none");

  const validAccounts = [
    { id: "test@test.com", pw: "1234" },
    { id: "admin@sh.com", pw: "admin123" },
  ];

  // 사번(이메일) 형식 유효성 검사
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (employeeId.length === 0) {
      setErrorTypeID("none");
    } else if (!emailRegex.test(employeeId)) {
      setErrorTypeID("invalid");
    } else {
      const matched = validAccounts.find(acc => acc.id === employeeId);
      setErrorTypeID(matched ? "none" : "notfound");
    }
  }, [employeeId]);

  // 로그인 버튼 활성화 조건
  const isLoginEnabled = employeeId.length > 0 && password.length > 0;

  // 로그인 처리 함수
  const handleLogin = async () => {
    const res =
      employeeId === "test@test.com" && password === "1234"
        ? MOCK_LOGIN_RESPONSE
        : MOCK_LOGIN_FAILURE_RESPONSE;

    if (!res.is_success) {
      console.error("로그인 실패:", res.message);
      setErrorTypeID("none");
      seterrorTypePw("invalid");
    } else {
      console.log("로그인 성공:", res.result?.access_token);
      setErrorTypeID("none");
      seterrorTypePw("none");
    }
  };

  return (
    <div className="w-full h-screen bg-gray-10 flex items-center justify-center">
      {/* 전체 wrapper: 360x475 */}
      <div className="w-[360px] h-[475px] flex flex-col items-center">
        {/* 로고 */}
        <img
          src={logo}
          alt="Shinhan Logo"
          className="w-[170.72864px] h-[151px]"
        />

        {/* 입력폼 영역 */}
        <div className="mt-[120px] w-full flex flex-col gap-[16px]">
          <IDInputField
            value={employeeId}
            setValue={setEmployeeId}
            errorTypeID={errorTypeID}
          />
          <PasswordInputField
            value={password}
            setValue={setPassword}
            errorTypePw={errorTypePw}
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          className={`mt-[24px] w-full px-[16px] py-[12px] ${
            isLoginEnabled ? "bg-main" : "bg-gray-40"
          } text-gray-10 text-body2 rounded-[8px] outline-[1px] outline-gray-30 flex items-center justify-center`}
          disabled={!isLoginEnabled}
          onClick={handleLogin}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
