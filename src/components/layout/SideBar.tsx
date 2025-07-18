import Alert from "@/assets/svgs/layout/alert.svg";
import Board from "@/assets/svgs/layout/board.svg";
import Chat from "@/assets/svgs/layout/chat.svg";
import Home from "@/assets/svgs/layout/home.svg";
import Logout from "@/assets/svgs/layout/logout.svg";
import Pencil from "@/assets/svgs/layout/pencil.svg";
import Star from "@/assets/svgs/layout/star.svg";

const SideBar = ({ isOpen }: { isOpen: boolean }) => {
  if (isOpen) {
    return (
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[320px] bg-white transition-all duration-300">
        <div className="p-4 font-bold">
          <Home />
        </div>
        <div className="p-2 flex items-center">
          <Alert /> <span>수신함</span>
        </div>
        <div className="p-2 flex items-center">
          <Chat /> <span>내 담당 문의</span>
        </div>
        <div className="p-4 font-bold">게시판</div>
        <div className="p-2 flex items-center">
          <Board /> <span>Core 개발 2부</span>
        </div>
        <div className="p-2 flex items-center">
          <Board /> <span>전체</span>
        </div>
        <div className="p-2 flex items-center">
          <Pencil /> <span>내 문의</span>
        </div>
        <div className="p-2 flex items-center">
          <Star /> <span>스크랩</span>
        </div>
        <div className="p-2 flex items-center text-gray-400">
          <Logout /> <span>Logout</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sticky left-0 top-16 h-[calc(100vh-64px)] w-25 bg-white transition-all duration-300 flex flex-col items-center">
      {/* Compact sidebar content */}
      <div className="p-2">
        <Home />
      </div>
      <div className="p-2">
        <Alert />
      </div>
      <div className="p-2">
        <Chat />
      </div>
      <div className="p-2">
        <Board />
      </div>
      <div className="p-2">
        <Board />
      </div>
      <div className="p-2">
        <Pencil />
      </div>
      <div className="p-2">
        <Star />
      </div>
      <div className="p-2 text-gray-400">
        <Logout />
      </div>
    </aside>
  );
};

export default SideBar;
