import { useEffect, useState } from "react";

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
import GroupSelector from "@/components/layout/sidebar/GroupSelector";
import SideBarDivider from "@/components/layout/sidebar/SideBarDivider";
import SideBarLargeItem from "@/components/layout/sidebar/SideBarLargeItem";
import SideBarSmallItem from "@/components/layout/sidebar/SideBarSmallItem";
import TeamSelector from "@/components/layout/sidebar/TeamSelector";

type Props = {
  isOpen: boolean;
};

const SideBar = ({ isOpen }: Props) => {
  const id = "2";
  const [isGroupSelectorOpen, setIsGroupSelectorOpen] = useState(false);
  const [isGroupButtonHovered, setIsGroupButtonHovered] = useState(false);
  const [isGroupSelectorHovered, setIsGroupSelectorHovered] = useState(false);
  const [isTeamSelectorHovered, setIsTeamSelectorHovered] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [hoverOutTimer, setHoverOutTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const showGroupSelector =
    isGroupSelectorOpen || isGroupButtonHovered || isGroupSelectorHovered;

  const showTeamSelector =
    selectedGroupId !== null &&
    (isGroupSelectorHovered || isTeamSelectorHovered);

  useEffect(() => {
    if (!isGroupSelectorHovered && !isTeamSelectorHovered) {
      const timer = setTimeout(() => {
        setSelectedGroupId(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isGroupSelectorHovered, isTeamSelectorHovered]);

  useEffect(() => {
    if (!isOpen) {
      setIsGroupSelectorOpen(false);
      setIsGroupButtonHovered(false);
      setIsGroupSelectorHovered(false);
      setIsTeamSelectorHovered(false);
      setSelectedGroupId(null);
    }
  }, [isOpen]);

  const handleGroupButtonMouseEnter = () => {
    if (hoverOutTimer) clearTimeout(hoverOutTimer);
    setIsGroupButtonHovered(true);
  };

  const handleGroupButtonMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsGroupButtonHovered(false);
    }, 100);
    setHoverOutTimer(timer);
  };

  const handleGroupSelectorMouseEnter = () => {
    if (hoverOutTimer) clearTimeout(hoverOutTimer);
    setIsGroupSelectorHovered(true);
  };

  const handleGroupSelectorMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsGroupSelectorHovered(false);
    }, 100);
    setHoverOutTimer(timer);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".sidebar") &&
        !target.closest(".group-selector") &&
        !target.closest(".team-selector")
      ) {
        setIsGroupSelectorOpen(false);
        setSelectedGroupId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <aside
        className={clsx(
          "fixed left-0 top-16 h-[calc(100vh-64px)] bg-white overflow-visible transition-[width] duration-300 sidebar",
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
          <SideBarLargeItem icon={Bell} label="수신함" path="/inbox" />
          <SideBarDivider />
          <p className="text-heading3-b text-gray-80 m-2">게시판</p>
          <SideBarLargeItem
            icon={Grid}
            label="Core 개발 2부"
            path={`/team/${id}`}
          />
          <SideBarLargeItem
            icon={Grid}
            label="전체"
            onClick={() => setIsGroupSelectorOpen(prev => !prev)}
            onMouseEnter={handleGroupButtonMouseEnter}
            onMouseLeave={handleGroupButtonMouseLeave}
            active={isGroupSelectorOpen}
          />
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
          <SideBarSmallItem icon={Bell} activeIcon={BellActive} path="/inbox" />
          <SideBarDivider small />
          <SideBarSmallItem
            icon={Grid}
            activeIcon={GridActive}
            path={`/team/${id}`}
          />
          <SideBarSmallItem
            icon={Grid}
            activeIcon={GridActive}
            onClick={() => setIsGroupSelectorOpen(prev => !prev)}
            onMouseEnter={handleGroupButtonMouseEnter}
            onMouseLeave={handleGroupButtonMouseLeave}
            active={isGroupSelectorOpen}
          />
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

      {/* GroupSelector */}
      <div
        className={clsx(
          "absolute top-16 h-[calc(100vh-64px)] z-30 transition-all duration-300 ease-in-out group-selector",
          isOpen ? "left-[320px]" : "left-[100px]",
          showGroupSelector
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-4 pointer-events-none"
        )}
        onMouseEnter={handleGroupSelectorMouseEnter}
        onMouseLeave={handleGroupSelectorMouseLeave}
      >
        <GroupSelector
          onClose={() => {
            setIsGroupSelectorOpen(false);
            setSelectedGroupId(null);
          }}
          onGroupSelect={group => setSelectedGroupId(group)}
        />
      </div>

      {/* TeamSelector */}
      <div
        className={clsx(
          "absolute top-16 h-[calc(100vh-64px)] z-40 transition-all duration-300 ease-in-out team-selector",
          isOpen ? "left-[560px]" : "left-[340px]",
          selectedGroupId && showTeamSelector
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-4 pointer-events-none"
        )}
        onMouseEnter={() => setIsTeamSelectorHovered(true)}
        onMouseLeave={() => setIsTeamSelectorHovered(false)}
      >
        {selectedGroupId && (
          <TeamSelector
            groupId={selectedGroupId}
            onClose={() => setSelectedGroupId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SideBar;
