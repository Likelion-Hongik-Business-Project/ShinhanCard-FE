import { FC, SVGProps } from "react";

import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  icon: FC<SVGProps<SVGSVGElement>>;
  label: string;
  path?: string;
};

// 큰 사이드바 아이템
const SideBarLargeItem = ({ icon: Icon, label, path }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = path === location.pathname;
  const openGroupSelector = () => {
    alert("그룹 셀렉터 열기");
    // 전체 버튼에서 필요한 그룹 셀렉터. -> 팀 셀렉터도 추가적으로 열려야 함.
  };

  return (
    <li
      onClick={() => {
        if (path) navigate(path);
        else openGroupSelector();
      }}
      className={`w-[256px] h-10 flex items-center cursor-pointer rounded-[8px] transition 
        ${isActive ? "bg-main-bright" : "hover:bg-gray-10"}`}
    >
      <Icon className="ml-2 w-5 h-5" />
      <span
        className={`ml-4 text-gray-80 ${isActive ? "text-heading3-b" : "text-heading3"}`}
      >
        {label}
      </span>
    </li>
  );
};

export default SideBarLargeItem;
