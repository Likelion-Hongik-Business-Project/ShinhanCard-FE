import { FC, forwardRef, SVGProps } from "react";

import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  path?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isActive?: boolean;
  disableActiveStyle?: boolean;
};

// 작은 사이드바 아이템
const SideBarSmallItem = forwardRef<HTMLLIElement, Props>(
  (
    {
      icon: Icon,
      activeIcon: ActiveIcon,
      path,
      onClick,
      onMouseEnter,
      onMouseLeave,
      isActive: isActiveProp,
      disableActiveStyle,
    },
    ref
  ) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isRouteMatch = path === location.pathname;
    const isActive = isActiveProp ?? isRouteMatch;
    const activeStyle = isActive && !disableActiveStyle;

    const handleClick = () => {
      if (onClick) onClick();
      else if (path) navigate(path);
    };

    return (
      <li
        ref={ref}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`p-[10px] rounded-[8px] transition cursor-pointer ${
          activeStyle ? "bg-main-bright" : "hover:bg-gray-10"
        }`}
      >
        {activeStyle ? (
          <ActiveIcon className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5 text-gray-60" />
        )}
      </li>
    );
  }
);

export default SideBarSmallItem;
