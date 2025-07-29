import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { useNavigate } from "react-router-dom";

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
  isGroupSelectorOpen: boolean;
  setIsGroupSelectorOpen: (open: boolean) => void;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
};

const SideBar = ({
  isOpen,
  isGroupSelectorOpen,
  setIsGroupSelectorOpen,
  selectedGroupId,
  setSelectedGroupId,
}: Props) => {
  const id = "2";
  const [isGroupButtonHovered, setIsGroupButtonHovered] = useState(false);
  const [isGroupSelectorHovered, setIsGroupSelectorHovered] = useState(false);
  const [isTeamSelectorHovered, setIsTeamSelectorHovered] = useState(false);
  const [isGroupSelectorFixed, setIsGroupSelectorFixed] = useState(false);

  const navigate = useNavigate();
  const hoverOutTimer = useRef<NodeJS.Timeout | null>(null);

  const clearHoverOutTimer = () => {
    if (hoverOutTimer.current) {
      clearTimeout(hoverOutTimer.current);
      hoverOutTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearHoverOutTimer();
    hoverOutTimer.current = setTimeout(() => {
      setIsGroupButtonHovered(false);
      setIsGroupSelectorHovered(false);
      setIsTeamSelectorHovered(false);
      if (!isGroupSelectorFixed) {
        setIsGroupSelectorOpen(false);
        setSelectedGroupId(null);
      }
    }, 100);
  };

  const showGroupSelector =
    isGroupSelectorFixed ||
    isGroupSelectorOpen ||
    isGroupButtonHovered ||
    (isGroupSelectorHovered && !isTeamSelectorHovered);

  const showTeamSelector =
    selectedGroupId !== null &&
    (isGroupSelectorFixed || isGroupSelectorHovered || isTeamSelectorHovered);

  useEffect(() => {
    if (!isOpen) {
      setIsGroupSelectorOpen(false);
      setIsGroupButtonHovered(false);
      setIsGroupSelectorHovered(false);
      setIsTeamSelectorHovered(false);
      setSelectedGroupId(null);
      setIsGroupSelectorFixed(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".sidebar") &&
        !target.closest(".group-selector") &&
        !target.closest(".team-selector")
      ) {
        setIsGroupSelectorOpen(false);
        setIsGroupSelectorHovered(false);
        setSelectedGroupId(null);
        setIsGroupSelectorFixed(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGroupButtonMouseEnter = () => {
    clearHoverOutTimer();
    setIsGroupButtonHovered(true);
  };

  const handleGroupButtonMouseLeave = () => {
    scheduleClose();
  };

  const handleGroupSelectorMouseEnter = () => {
    clearHoverOutTimer();
    setIsGroupSelectorHovered(true);
  };

  const handleGroupSelectorMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement;
    if (
      related?.closest(".group-selector") ||
      related?.closest(".team-selector")
    ) {
      return;
    }
    scheduleClose();
  };

  const handleTeamSelectorMouseEnter = () => {
    clearHoverOutTimer();
    setIsTeamSelectorHovered(true);
  };

  const handleTeamSelectorMouseLeave = () => {
    scheduleClose();
  };

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
            onClick={() => {
              const next = !isGroupSelectorOpen;
              setIsGroupSelectorOpen(next);
              setIsGroupSelectorFixed(next);
            }}
            onMouseEnter={handleGroupButtonMouseEnter}
            onMouseLeave={handleGroupButtonMouseLeave}
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
            onClick={() => {
              const next = !isGroupSelectorOpen;
              setIsGroupSelectorOpen(next);
              setIsGroupSelectorFixed(next);

              if (!next) {
                setIsGroupButtonHovered(false);
                setIsGroupSelectorHovered(false);
                setIsTeamSelectorHovered(false);
              }
            }}
            onMouseEnter={handleGroupButtonMouseEnter}
            onMouseLeave={handleGroupButtonMouseLeave}
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
          onGroupSelect={group => {
            if (group) {
              setSelectedGroupId(String(group.group_id));
              setIsGroupSelectorFixed(true);
            }
          }}
          selectedGroupId={Number(selectedGroupId)}
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
        onMouseEnter={handleTeamSelectorMouseEnter}
        onMouseLeave={handleTeamSelectorMouseLeave}
      >
        {selectedGroupId && (
          <TeamSelector
            groupId={Number(selectedGroupId)}
            onTeamSelect={team => {
              clearHoverOutTimer();
              navigate(`/team/${team.teamId}`);
              setIsGroupSelectorOpen(false);
              setIsGroupButtonHovered(false);
              setSelectedGroupId(null);
              setIsGroupSelectorFixed(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SideBar;
