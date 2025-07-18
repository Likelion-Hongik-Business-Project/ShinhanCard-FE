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
  Star,
  StarActive,
} from "@/assets/svgs/layout";
import SideBarDivider from "@/components/layout/SideBarDivider";
import SideBarLargeItem from "@/components/layout/SideBarLargeItem";
import SideBarSmallItem from "@/components/layout/SideBarSmallItem";

type Props = {
  isOpen: boolean;
};

const SideBar = ({ isOpen }: Props) => {
  const id = "2"; // TODO: 팀 아이디 동적으로 가져오는 로직으로 변경 필요

  if (isOpen) {
    return (
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[320px] bg-white transition-all duration-300">
        <ul className="pt-[52px] px-8 flex flex-col gap-6">
          <SideBarLargeItem icon={Home} label="홈" path="/" />
          <SideBarDivider />

          <p className="text-heading3-b text-gray-80 m-2">담당 문의</p>
          <SideBarLargeItem icon={Bell} label="수신함" path="/inbox" />
          <SideBarLargeItem
            icon={Message}
            label="내 담당 문의"
            path="/assigned"
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
          <SideBarLargeItem
            icon={Pencil}
            label="내 문의"
            path="/my-questions"
          />
          <SideBarLargeItem icon={Star} label="스크랩" path="/scrap" />
        </ul>
      </aside>
    );
  }

  return (
    <aside className="sticky left-0 top-16 mt-16 h-[calc(100vh-64px)] w-25 bg-white flex flex-col items-center">
      <ul className="pt-[52px] px-8 flex flex-col gap-6 items-center">
        <SideBarSmallItem icon={Home} activeIcon={HomeActive} path="/" />
        <SideBarDivider small />
        <div className="h-[40px]" />
        <SideBarSmallItem icon={Bell} activeIcon={BellActive} path="/inbox" />
        <SideBarSmallItem
          icon={Message}
          activeIcon={MessageActive}
          path="/assigned"
        />
        <SideBarDivider small />
        <div className="h-[40px]" />
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
        <SideBarSmallItem icon={Star} activeIcon={StarActive} path="/scrap" />
      </ul>
    </aside>
  );
};

export default SideBar;
