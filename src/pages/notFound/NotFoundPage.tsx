import { useNavigate } from "react-router-dom";

import Home from "@/assets/svgs/layout/home.svg";
import NotFound from "@/assets/svgs/notFound/404.svg";
import Button from "@/components/common/Button";

import { useAuthStore } from "@/store/useAuthStore";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const isLogin = useAuthStore(state => state.isLogin);

  const handleClick = () => {
    if (isLogin) {
      navigate("/"); // 로그인 한 상태라면 home 으로 이동
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-10 flex flex-col justify-center items-center">
      <NotFound className="w-[367px] h-50" />
      <h2 className="mt-10 text-heading1 text-gray-60">
        페이지를 찾을 수 없습니다.
      </h2>
      <p className="mt-6 text-body1 text-gray-40">
        입력하신 경로를 다시 확인하거나 홈으로 돌아가 주세요.
      </p>
      <Button
        onClick={handleClick}
        buttonType="blue"
        className="flex gap-5 mt-10"
      >
        <Home className="w-4 h-4 text-white" />
        <span className="text-heading3 text-white">홈으로</span>
      </Button>
    </div>
  );
};

export default NotFoundPage;
