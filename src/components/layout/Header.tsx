import Down from "@/assets/svgs/layout/down.svg";
import Logo from "@/assets/svgs/layout/logo.svg";
import Menu from "@/assets/svgs/layout/menu.svg";
import Profile from "@/assets/svgs/layout/profile.svg";
import Search from "@/assets/svgs/layout/search.svg";

const Header = () => {
  return (
    <header className="h-16 w-full bg-white border-b border-gray-20 pl-9 pr-11 flex items-center justify-between z-100">
      <div className="flex items-center">
        <Menu className="w-6 h-6 cursor-pointer" />
        <Logo className="w-8 h-8 ml-10" />
        <div className="ml-[215px] h-10 w-[640px] 1400:w-[700px] rounded-[30px] bg-gray-10 border border-gray-60 px-5 flex items-center">
          <Search className="w-5 h-5" />
          <input
            type="text"
            placeholder="검색"
            className="w-full h-full bg-transparent outline-none text-gray-60 text-heading3 ml-4 placeholder:text-gray-60 placeholder:text-heading3"
          />
        </div>
      </div>
      <div className="flex items-center space-x-7 p-[9px] ml-[86px] cursor-pointer">
        <div className="flex items-center space-x-4">
          <Profile />
          <span className="text-gray-80 text-heading2 whitespace-nowrap">
            장윤영
          </span>
        </div>
        <Down />
      </div>
    </header>
  );
};

export default Header;
