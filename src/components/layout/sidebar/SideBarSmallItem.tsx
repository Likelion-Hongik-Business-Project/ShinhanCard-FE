import { FC, SVGProps } from "react";

import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  path?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  active?: boolean;
};

// 작은 사이드바 아이템
const SideBarSmallItem = ({
  icon: Icon,
  activeIcon: ActiveIcon,
  path,
  onClick,
  onMouseEnter,
  onMouseLeave,
  active,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = active !== undefined ? active : path === location.pathname;

  const handleClick = () => {
    if (path) {
      navigate(path);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <li
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
