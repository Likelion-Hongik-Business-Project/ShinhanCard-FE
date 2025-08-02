import Down from "@/assets/svgs/common/down.svg";
import Profile from "@/assets/svgs/common/profile.svg";
import { Logo, Menu } from "@/assets/svgs/layout";
import SearchBar from "@/components/searchBar/SearchBar";

type Props = {
  toggleSidebar: () => void;
  onSearchActiveChange?: (isActive: boolean) => void;
};

const Header = ({ toggleSidebar, onSearchActiveChange }: Props) => {
  const user = { name: "장윤영" }; // TODO: 사용자 정보 동적으로 가져오는 로직으로 변경 필요

  return (
    <header className="fixed h-16 w-full bg-white border-b border-gray-20 pl-9 pr-11 flex items-center justify-between z-100">
      <div className="flex items-center">
        <Menu onClick={toggleSidebar} className="w-6 h-6 cursor-pointer" />
        <Logo className="w-8 h-8 ml-10" />
        <SearchBar onSearchActiveChange={onSearchActiveChange} />
      </div>
      <div className="flex items-center space-x-7 p-[9px] ml-[86px] cursor-pointer rounded-[8px] hover:bg-gray-10 transition">
        <div className="flex items-center space-x-4">
          <Profile />
          <span className="text-gray-80 text-heading2 whitespace-nowrap">
            {user?.name || "이름"}
          </span>
        </div>
        <Down className="w-6 h-6" />
      </div>
    </header>
  );
};

export default Header;
