import { FC, SVGProps } from "react";

import { useNavigate } from "react-router-dom";

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
  const id = "2"; // TODO: 팀 아이디 동적으로 가져오는 로직으로 변경 필요

  if (isOpen) {
    return (
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[320px] bg-white transition-all duration-300">
        <ul className="pt-[52px] px-8 flex flex-col gap-6">
          <SideBarItem icon={Home} label="홈" path="/" />
          <Divider />

          <p className="text-heading3-b text-gray-80 m-2">담당 문의</p>
          <SideBarItem icon={Bell} label="수신함" path="/inbox" />
          <SideBarItem icon={Message} label="내 담당 문의" path="/assigned" />

          <Divider />
          <p className="text-heading3-b text-gray-80 m-2">게시판</p>
          <SideBarItem icon={Grid} label="Core 개발 2부" path={`/team/${id}`} />
          <SideBarItem icon={Grid} label="전체" />

          <Divider />
          <SideBarItem icon={Pencil} label="내 문의" path="/my-questions" />
          <SideBarItem icon={Star} label="스크랩" path="/scrap" />
        </ul>
      </aside>
    );
  }

  return (
    <aside className="sticky left-0 top-16 mt-16 h-[calc(100vh-64px)] w-25 bg-white flex flex-col items-center">
      <ul className="pt-[52px] px-8 flex flex-col gap-6 items-center">
        <SideBarIcon icon={Home} path="/" />
        <Divider small />
        <div className="h-[40px]" />
        <SideBarIcon icon={Bell} path="/inbox" />
        <SideBarIcon icon={Message} path="/assigned" />
        <Divider small />
        <div className="h-[40px]" />
        <SideBarIcon icon={Grid} path={`/team/${id}`} />
        <SideBarIcon icon={Grid} />
        <Divider small />
        <SideBarIcon icon={Pencil} path="/my-questions" />
        <SideBarIcon icon={Star} path="/scrap" />
      </ul>
    </aside>
  );
};

export default SideBar;

type SideBarItemProps = {
  icon: FC<SVGProps<SVGSVGElement>>;
  label: string;
  path?: string;
};

// 큰 사이드바 아이템
const SideBarItem = ({ icon: Icon, label, path }: SideBarItemProps) => {
  const navigate = useNavigate();
  const openGroupSelector = () => {
    alert("그룹 셀렉터 열기");
    // 전체 버튼에서 필요한 그룹 셀렉터. -> 팀 셀렉터도 추가적으로 열려야 함.
  };

  return (
    <li
      onClick={() => {
        if (path) navigate(path);
        else openGroupSelector();
      }}
      className="w-[256px] h-10 hover:bg-gray-10 flex items-center cursor-pointer rounded-[8px] transition"
    >
      <Icon className="ml-2 w-5 h-5" />
      <span className="text-gray-80 text-heading3 ml-4">{label}</span>
    </li>
  );
};

type SideBarIconProps = {
  icon: FC<SVGProps<SVGSVGElement>>;
  path?: string;
};

// 작은 사이드바 아이콘
const SideBarIcon = ({ icon: Icon, path }: SideBarIconProps) => {
  const navigate = useNavigate();
  const openGroupSelector = () => {
    alert("그룹 셀렉터 열기");
    // 전체 버튼에서 필요한 그룹 셀렉터. -> 팀 셀렉터도 추가적으로 열려야 함.
  };
  return (
    <li
      onClick={() => {
        if (path) navigate(path);
        else openGroupSelector();
      }}
      className="p-[10px] hover:bg-gray-10 rounded-[8px] transition cursor-pointer"
    >
      <Icon className="w-5 h-5" />
    </li>
  );
};

type DividerProps = {
  small?: boolean;
};

// Divider
const Divider = ({ small }: DividerProps) => (
  <div
    className={`${small ? "w-16" : "w-[240px]"} h-[2px] ${
      small ? "" : "mx-auto"
    } bg-gray-20 my-2`}
  />
);
