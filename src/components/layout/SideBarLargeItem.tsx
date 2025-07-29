import { FC, forwardRef, SVGProps } from "react";

import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  icon: FC<SVGProps<SVGSVGElement>>;
  label: string;
  path?: string;
  onClick?: () => void;
  isActive?: boolean;
};

// 큰 사이드바 아이템
const SideBarLargeItem = forwardRef<HTMLLIElement, Props>(
  ({ icon: Icon, label, path, onClick, isActive: isActiveProp }, ref) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isRouteMatch = path === location.pathname;
    const isActive = isActiveProp ?? isRouteMatch;

    const handleClick = () => {
      if (onClick) onClick();
      else if (path) navigate(path);
    };

    return (
      <li
        ref={ref}
        onClick={handleClick}
        className={`w-[256px] h-10 flex items-center cursor-pointer rounded-[8px] transition 
        ${isActive ? "bg-gray-10" : "hover:bg-gray-10"}`}
      >
        <Icon className="ml-2 w-5 h-5 text-gray-60" />
        <span
          className={`ml-4 text-gray-80 ${isActive ? "text-body1-b" : "text-body1"}`}
        >
          {label}
        </span>
      </li>
    );
  }
);

export default SideBarLargeItem;
