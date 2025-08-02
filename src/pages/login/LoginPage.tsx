import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Logo from "@/assets/svgs/login/logo.svg";
import IDInputField from "@/components/login/IDInputField";
import PasswordInputField from "@/components/login/PasswordInputField";
import { useAuth } from "@/hooks/auth/useAuth";

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [errorTypeID, setErrorTypeID] = useState<
    "invalid" | "notfound" | "none"
  >("none");
  const [errorTypePw, seterrorTypePw] = useState<"none" | "invalid">("none");
  const { login } = useAuth();

  // 로그인 버튼 활성화 조건
  const isLoginEnabled = employeeId.length > 0 && password.length > 0;

  const navigate = useNavigate();

  // 사번 형식 (영어, 숫자만) 유효성 검사
  useEffect(() => {
    const idRegex = /^[a-zA-Z0-9]+$/;

    if (employeeId.length === 0) {
      setErrorTypeID("none");
    } else if (!idRegex.test(employeeId)) {
      setErrorTypeID("invalid");
    } else {
      setErrorTypeID("none");
    }
  }, [employeeId]);

  const handleLogin = async () => {
    try {
      await login({ employeeId, password });
      setErrorTypeID("none");
      seterrorTypePw("none");
      navigate("/");
    } catch (code) {
      if (code === "USER400") {
        // 비밀번호 오류
        setErrorTypeID("none");
        seterrorTypePw("invalid");
      } else if (code === "USER404") {
        // 사번 오류
        setErrorTypeID("notfound");
        seterrorTypePw("none");
      } else {
        setErrorTypeID("invalid");
        seterrorTypePw("invalid");
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gray-10 flex items-center justify-center">
      <div className="w-[360px] h-[475px] flex flex-col items-center">
        {/* 로고 */}
        <Logo className="w-[171px] h-[151px]" />

        {/* 입력폼 영역 */}
        <form className="mt-[120px] w-full flex flex-col gap-[16px]">
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
        </form>

        {/* 로그인 버튼 */}
        <button
          className={`mt-[24px] w-full px-[16px] py-[12px] ${
            isLoginEnabled ? "bg-main cursor-pointer" : "bg-gray-40"
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
