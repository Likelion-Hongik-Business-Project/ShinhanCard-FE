import Bell from "@/assets/svgs/layout/bell.svg";
import Grid from "@/assets/svgs/layout/grid.svg";
import Home from "@/assets/svgs/layout/home.svg";
import Message from "@/assets/svgs/layout/message.svg";
import Pencil from "@/assets/svgs/layout/pencil.svg";
import Star from "@/assets/svgs/layout/star.svg";

type Props = {
  isOpen: boolean;
};

const SideBar = ({ isOpen }: Props) => {
  if (isOpen) {
    return (
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[320px] bg-white transition-all duration-300">
        <ul className="pt-[52px] px-8 flex flex-col gap-6">
          <li className="w-[256px] h-10 hover:bg-gray-10 flex items-center cursor-pointer rounded-[8px] transition">
            <Home className="ml-2 w-5 h-5" />
            <span className="text-gray-80 text-heading3 ml-4">홈</span>
          </li>
          <div className="w-[240px] h-[2px] mx-auto bg-gray-20 my-2" />

          <p className="text-heading3-b text-gray-80 m-2">담당 문의</p>

          <li className="w-[256px] h-10 hover:bg-gray-10 flex items-center cursor-pointer rounded-[8px] transition">
            <Bell className="ml-2 w-5 h-5" />
            <span className="text-gray-80 text-heading3 ml-4">수신함</span>
          </li>

          <li className="w-[256px] h-10 hover:bg-gray-10 flex items-center cursor-pointer rounded-[8px] transition">
            <Message className="ml-2 w-5 h-5" />
            <span className="text-gray-80 text-heading3 ml-4">
              내 담당 문의
            </span>
          </li>

          <div className="w-[240px] h-[2px] bg-gray-20 my-2" />

          <p className="text-heading3-b text-gray-80 m-2">게시판</p>

          <li className="w-[256px] h-10 hover:bg-gray-10 flex items-center cursor-pointer rounded-[8px] transition">
            <Grid className="ml-2 w-5 h-5" />
            <span className="text-gray-80 text-heading3 ml-4">
              Core 개발 2부
            </span>
          </li>

          <li className="w-[256px] h-10 hover:bg-gray-10 flex items-center cursor-pointer rounded-[8px] transition">
            <Grid className="ml-2 w-5 h-5" />
            <span className="text-gray-80 text-heading3 ml-4">전체</span>
          </li>

          <div className="w-[240px] h-[2px] bg-gray-20 my-2" />

          <li className="w-[256px] h-10 hover:bg-gray-10 flex items-center cursor-pointer rounded-[8px] transition">
            <Pencil className="ml-2 w-5 h-5" />
            <span className="text-gray-80 text-heading3 ml-4">내 문의</span>
          </li>

          <li className="w-[256px] h-10 hover:bg-gray-10 flex items-center cursor-pointer rounded-[8px] transition">
            <Star className="ml-2 w-5 h-5" />
            <span className="text-gray-80 text-heading3 ml-4">스크랩</span>
          </li>
        </ul>
      </aside>
    );
  }

  return (
    <aside className="sticky left-0 top-16 mt-16 min-h-[calc(100vh-64px)] max-h-[1080px] w-25 bg-white flex flex-col items-center">
      <ul className="pt-[52px] px-8 flex flex-col gap-6 items-center">
        <li className="p-[10px] cursor-pointer">
          <Home className="w-5 h-5" />
        </li>
        <div className="w-16 h-[2px] bg-gray-20 my-2" />
        <div className="h-[40px]" />
        <li className="p-[10px] cursor-pointer">
          <Bell className="w-5 h-5" />
        </li>
        <li className="p-[10px] cursor-pointer">
          <Message className="w-5 h-5" />
        </li>
        <div className="w-16 h-[2px] bg-gray-20 my-2" />
        <div className="h-[40px]" />
        <li className="p-[10px] cursor-pointer">
          <Grid className="w-5 h-5" />
        </li>
        <li className="p-[10px] cursor-pointer">
          <Grid className="w-5 h-5" />
        </li>
        <div className="w-16 h-[2px] bg-gray-20 my-2" />
        <li className="p-[10px] cursor-pointer">
          <Pencil className="w-5 h-5" />
        </li>
        <li className="p-[10px] cursor-pointer">
          <Star className="w-5 h-5" />
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
