import { FC, SVGProps } from "react";

import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  icon: FC<SVGProps<SVGSVGElement>>;
  label: string;
  path?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  active?: boolean;
};

// 큰 사이드바 아이템
const SideBarLargeItem = ({
  icon: Icon,
  label,
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
      className={`w-[256px] h-10 flex items-center cursor-pointer rounded-[8px] transition 
        ${isActive ? "bg-gray-10" : "hover:bg-gray-10"}`}
    >
      <Icon className="ml-2 w-5 h-5" />
      <span
        className={`ml-4 text-gray-80 ${isActive ? "text-body1-b" : "text-body1"}`}
      >
        {label}
      </span>
    </li>
  );
};

export default SideBarLargeItem;
