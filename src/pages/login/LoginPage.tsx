import { useEffect, useState } from "react";

import logo from "@/assets/svgs/login/shinhanLogo_cut.png";
import IDInputField from "@/components/login/IDInputField";
import PasswordInputField from "@/components/login/PasswordInputField";

import "@/styles/globals.css";

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [errorType, setErrorType] = useState<"invalid" | "notfound" | "none">(
    "none"
  );

  // 사번(이메일) 형식 유효성 검사
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (employeeId.length === 0) {
      setErrorType("none");
    } else if (!emailRegex.test(employeeId)) {
      setErrorType("invalid");
    } else {
      // 사내 DB 확인 (예시)
      const knownIds = ["test@test.com", "admin@sh.com"]; // 예시 DB
      if (!knownIds.includes(employeeId)) {
        setErrorType("notfound");
      } else {
        setErrorType("none");
      }
    }
  }, [employeeId]);

  // 2. 로그인 버튼 활성화 조건
  const isLoginEnabled = employeeId.length > 0 && password.length > 0;

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
            errorType={errorType}
          />
          <PasswordInputField value={password} setValue={setPassword} />
        </div>

        {/* 로그인 버튼 */}
        <button
          className={`mt-[24px] w-full px-[16px] py-[12px] ${
            isLoginEnabled ? "bg-main" : "bg-gray-40"
          } text-gray-10 text-body2 rounded-[8px] outline-[1px] outline-gray-30 flex items-center justify-center`}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
