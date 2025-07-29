import clsx from "clsx";

import Star from "@/assets/svgs/common/star.svg";
import StarActive from "@/assets/svgs/common/star-active.svg";
import {
  Bell,
  BellActive,
  Grid,
  GridActive,
  Home,
  HomeActive,
  Message,
  MessageActive,
  Pencil,
  PencilActive,
} from "@/assets/svgs/layout";
import SideBarDivider from "@/components/layout/SideBarDivider";
import SideBarLargeItem from "@/components/layout/SideBarLargeItem";
import SideBarSmallItem from "@/components/layout/SideBarSmallItem";

type Props = {
  isOpen: boolean;
  toggleInbox: () => void;
  isInboxOpen: boolean;
};

const SideBar = ({ isOpen, toggleInbox, isInboxOpen }: Props) => {
  const id = "2"; // TODO: 팀 아이디 동적으로 가져오는 로직으로 변경 필요

  return (
    <aside
      className={clsx(
        "fixed left-0 top-16 h-[calc(100vh-64px)] bg-white overflow-hidden transition-[width] duration-300 z-100",
        isOpen ? "w-[320px]" : "w-25 flex flex-col items-center"
      )}
    >
      {/* 큰 사이드바 */}
      <ul
        className={clsx(
          "pt-[52px] px-8 flex flex-col gap-4 absolute top-0 left-0 w-full transition-all",
          isOpen
            ? "opacity-100 translate-x-0 duration-300 delay-100 pointer-events-auto"
            : "opacity-0 -translate-x-2 duration-200 delay-0 pointer-events-none"
        )}
      >
        <SideBarLargeItem icon={Home} label="홈" path="/" />
        <SideBarLargeItem
          icon={Bell}
          label="수신함"
          onClick={toggleInbox}
          isActive={isInboxOpen}
        />
        <SideBarDivider />
        <p className="text-heading3-b text-gray-80 m-2">게시판</p>
        <SideBarLargeItem
          icon={Grid}
          label="Core 개발 2부"
          path={`/team/${id}`}
        />
        <SideBarLargeItem icon={Grid} label="전체" />
        <SideBarDivider />
        <p className="text-heading3-b text-gray-80 m-2">내 스페이스</p>
        <SideBarLargeItem
          icon={Pencil}
          label="내가 쓴 문의"
          path="/my-questions"
        />
        <SideBarLargeItem
          icon={Message}
          label="내 담당 문의"
          path="/assigned"
        />
        <SideBarLargeItem icon={Star} label="스크랩" path="/scrap" />
      </ul>

      {/* 작은 사이드바 */}
      <ul
        className={clsx(
          "pt-[52px] px-8 flex flex-col gap-4 items-center absolute top-0 left-0 w-full transition-all",
          isOpen
            ? "opacity-0 translate-x-2 duration-200 delay-0 pointer-events-none"
            : "opacity-100 translate-x-0 duration-300 delay-100 pointer-events-auto"
        )}
      >
        <SideBarSmallItem icon={Home} activeIcon={HomeActive} path="/" />
        <SideBarSmallItem
          icon={Bell}
          activeIcon={BellActive}
          onClick={toggleInbox}
          isActive={isInboxOpen}
        />
        <SideBarDivider small />
        <SideBarSmallItem
          icon={Grid}
          activeIcon={GridActive}
          path={`/team/${id}`}
        />
        <SideBarSmallItem icon={Grid} activeIcon={GridActive} />
        <SideBarDivider small />
        <SideBarSmallItem
          icon={Pencil}
          activeIcon={PencilActive}
          path="/my-questions"
        />
        <SideBarSmallItem
          icon={Message}
          activeIcon={MessageActive}
          path="/assigned"
        />
        <SideBarSmallItem icon={Star} activeIcon={StarActive} path="/scrap" />
      </ul>
    </aside>
  );
};

export default SideBar;
