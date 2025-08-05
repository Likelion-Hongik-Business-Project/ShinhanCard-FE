import { useCallback, useRef } from "react";

import Down from "@/assets/svgs/common/down.svg";
import { Logo, Menu } from "@/assets/svgs/layout";
import SearchBar from "@/components/searchBar/SearchBar";
import { getProfileImageUrl } from "@/types/profile/profile.type";

import { useProfileStore } from "@/store/useProfileStore";

type Props = {
  toggleSidebar: () => void;
  onSearchActiveChange?: (isActive: boolean) => void;
  onProfileHoverChange?: (
    isHovered: boolean,
    offset?: { left: number; top: number }
  ) => void;
};

const Header = ({
  toggleSidebar,
  onSearchActiveChange,
  onProfileHoverChange,
}: Props) => {
  const { profile } = useProfileStore();

  // 프로필 모달 호버 상태
  const profileRef = useRef<HTMLDivElement>(null);

  // 프로필 호버 핸들러
  const handleProfileMouseEnter = useCallback(() => {
    if (profileRef.current && profile) {
      const target = profileRef.current;

      // 헤더 하단에 모달 위치 계산
      const left = target.offsetLeft + target.offsetWidth - 345; // 모달 너비만큼 왼쪽으로
      const top = target.offsetTop + target.offsetHeight + 8;

      onProfileHoverChange?.(true, { left, top });
    }
  }, [profile, onProfileHoverChange]);

  const handleProfileMouseLeave = useCallback(() => {
    onProfileHoverChange?.(false);
  }, [onProfileHoverChange]);

  return (
    <header className="fixed h-16 w-full bg-white border-b border-gray-20 pl-9 pr-11 flex items-center justify-between z-100">
      <div className="flex items-center">
        <Menu onClick={toggleSidebar} className="w-6 h-6 cursor-pointer" />
        <Logo className="w-8 h-8 ml-10" />
        <SearchBar onSearchActiveChange={onSearchActiveChange} />
      </div>
      <div
        ref={profileRef}
        className="flex items-center space-x-7 p-[9px] ml-[86px] cursor-pointer rounded-[8px] hover:bg-gray-10 transition relative"
        onMouseEnter={handleProfileMouseEnter}
        onMouseLeave={handleProfileMouseLeave}
      >
        <div className="flex items-center space-x-4">
          <img
            src={getProfileImageUrl(profile?.profile_image_url || "")}
            alt={profile?.name}
            className="w-8 h-8 rounded-full object-cover"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = "/src/assets/svgs/common/profile.svg";
            }}
          />
          <span className="text-gray-80 text-heading2 whitespace-nowrap">
            {profile?.name || "이름"}
          </span>
        </div>
        <Down className="w-6 h-6" />
      </div>
    </header>
  );
};

export default Header;
