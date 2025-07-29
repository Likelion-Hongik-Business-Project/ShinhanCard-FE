import { FC, SVGProps } from "react";

import { useNavigate } from "react-router-dom";

type Props = {
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  path?: string;
  onClick?: () => void;
  isActive?: boolean;
};

// 작은 사이드바 아이템
const SideBarSmallItem = ({
  icon: Icon,
  activeIcon: ActiveIcon,
  path,
  onClick,
  isActive: activeFromProps,
}: Props) => {
  const navigate = useNavigate();
  const isRouteMatch = path === location.pathname;
  const isActive = activeFromProps ?? isRouteMatch;

  const handleClick = () => {
    if (onClick) onClick();
    else if (path) navigate(path);
  };

  return (
    <li
      onClick={handleClick}
      className={`p-[10px] rounded-[8px] transition cursor-pointer ${
        isActive ? "bg-main-bright" : "hover:bg-gray-10"
      }`}
    >
      {isActive ? (
        <ActiveIcon className="w-5 h-5" />
      ) : (
        <Icon className="w-5 h-5 text-gray-60" />
      )}
    </li>
  );
};

export default SideBarSmallItem;
