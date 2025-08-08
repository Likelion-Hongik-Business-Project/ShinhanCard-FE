import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import Star from "@/assets/svgs/common/star.svg";
import StarActive from "@/assets/svgs/common/star-active.svg";
import {
  Bell,
  BellActive,
  BellNoti,
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
import { useUnreadCount } from "@/hooks/inbox/useInboxApi";

type Props = {
  isOpen: boolean;
  isGroupSelectorOpen: boolean;
  setIsGroupSelectorOpen: (open: boolean) => void;
  selectedGroupId: number | null;
  setSelectedGroupId: (id: number | null) => void;
  toggleInbox: () => void;
  isInboxOpen: boolean;
  inboxLargeRef: React.RefObject<HTMLLIElement | null>;
  inboxSmallRef: React.RefObject<HTMLLIElement | null>;
};

const SideBar = ({
  isOpen,
  isGroupSelectorOpen,
  setIsGroupSelectorOpen,
  selectedGroupId,
  setSelectedGroupId,
  toggleInbox,
  isInboxOpen,
  inboxLargeRef,
  inboxSmallRef,
}: Props) => {
  const id = "2";

  const [hovered, setHovered] = useState({
    group: false,
    groupSelector: false,
    team: false,
  });
  const [isGroupSelectorFixed, setIsGroupSelectorFixed] = useState(false);

  const navigate = useNavigate();
  const hoverOutTimer = useRef<NodeJS.Timeout | null>(null);

  const unread = useUnreadCount();
  const hasUnread = unread > 0;

  const LargeBellIcon = hasUnread ? BellNoti : Bell;
  const SmallBellIcon = hasUnread ? BellNoti : Bell;

  const clearHoverOutTimer = () => {
    if (hoverOutTimer.current) {
      clearTimeout(hoverOutTimer.current);
      hoverOutTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearHoverOutTimer();
    hoverOutTimer.current = setTimeout(() => {
      setHovered({ group: false, groupSelector: false, team: false });
      if (!isGroupSelectorFixed) {
        setIsGroupSelectorOpen(false);
        setSelectedGroupId(null);
      }
    }, 100);
  };

  const showGroupSelector =
    isGroupSelectorFixed ||
    isGroupSelectorOpen ||
    hovered.group ||
    (hovered.groupSelector && !hovered.team);

  const showTeamSelector =
    selectedGroupId !== null &&
    (isGroupSelectorFixed || hovered.groupSelector || hovered.team);

  const toggleGroupSelector = () => {
    const next = !isGroupSelectorOpen;
    setIsGroupSelectorOpen(next);
    setIsGroupSelectorFixed(next);
    if (!next) {
      setHovered({ group: false, groupSelector: false, team: false });
      setSelectedGroupId(null);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsGroupSelectorOpen(false);
      setSelectedGroupId(null);
      setIsGroupSelectorFixed(false);
      setHovered({ group: false, groupSelector: false, team: false });
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
        setSelectedGroupId(null);
        setIsGroupSelectorFixed(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEnter = (key: keyof typeof hovered) => {
    clearHoverOutTimer();
    setHovered(prev => ({ ...prev, [key]: true }));
  };

  const handleLeave = () => {
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
            icon={LargeBellIcon}
            label="수신함"
            onClick={toggleInbox}
            isActive={isInboxOpen}
            ref={inboxLargeRef}
            disableActiveStyle
          />
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
            onClick={toggleGroupSelector}
            onMouseEnter={() => handleEnter("group")}
            onMouseLeave={handleLeave}
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
            icon={SmallBellIcon}
            activeIcon={BellActive}
            onClick={toggleInbox}
            isActive={isInboxOpen}
            ref={inboxSmallRef}
            disableActiveStyle
          />
          <SideBarDivider small />
          <SideBarSmallItem
            icon={Grid}
            activeIcon={GridActive}
            path={`/team/${id}`}
          />
          <SideBarSmallItem
            icon={Grid}
            activeIcon={GridActive}
            onClick={toggleGroupSelector}
            onMouseEnter={() => handleEnter("group")}
            onMouseLeave={handleLeave}
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

      <div
        className={clsx(
          "fixed left-0 top-16 h-[calc(100vh-64px)] bg-white overflow-visible z-30 transition-all duration-300 ease-in-out group-selector",
          isOpen ? "left-[320px]" : "left-[100px]",
          showGroupSelector
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-4 pointer-events-none"
        )}
        onMouseEnter={() => handleEnter("groupSelector")}
        onMouseLeave={handleLeave}
      >
        <GroupSelector
          onGroupSelect={group => {
            if (group) {
              setSelectedGroupId(group.group_id);
              setIsGroupSelectorFixed(true);
            }
          }}
          selectedGroupId={selectedGroupId}
        />
      </div>

      <div
        className={clsx(
          "fixed left-0 top-16 h-[calc(100vh-64px)] bg-white overflow-visible z-40 transition-all duration-300 ease-in-out team-selector",
          isOpen ? "left-[560px]" : "left-[340px]",
          selectedGroupId && showTeamSelector
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-4 pointer-events-none"
        )}
        onMouseEnter={() => handleEnter("team")}
        onMouseLeave={handleLeave}
      >
        {selectedGroupId !== null && showTeamSelector && (
          <TeamSelector
            groupId={selectedGroupId}
            onTeamSelect={team => {
              clearHoverOutTimer();
              navigate(`/team/${team.teamId}`);
              setIsGroupSelectorOpen(false);
              setSelectedGroupId(null);
              setIsGroupSelectorFixed(false);
              setHovered({ group: false, groupSelector: false, team: false });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SideBar;
