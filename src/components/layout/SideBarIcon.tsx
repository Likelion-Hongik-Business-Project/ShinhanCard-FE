import { FC, SVGProps } from "react";

import { useNavigate } from "react-router-dom";

type SideBarIconProps = {
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  path?: string;
};

// 작은 사이드바 아이콘
const SideBarIcon = ({
  icon: Icon,
  activeIcon: ActiveIcon,
  path,
}: SideBarIconProps) => {
  const navigate = useNavigate();
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
      className={`p-[10px] rounded-[8px] transition cursor-pointer ${
        isActive ? "bg-main-bright" : "hover:bg-gray-10"
      }`}
    >
      {isActive ? (
        <ActiveIcon className="w-5 h-5" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
    </li>
  );
};

export default SideBarIcon;
