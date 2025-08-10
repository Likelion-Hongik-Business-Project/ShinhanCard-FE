import { useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import User from "@/assets/svgs/home/icon-user.svg";
import Logout from "@/assets/svgs/profile/logout.svg";
import Mail from "@/assets/svgs/profile/mail.svg";
import Phone from "@/assets/svgs/profile/phone.svg";
import { useAuth } from "@/hooks/auth/useAuth";
import { useOtherProfile } from "@/hooks/profile/useOtherProfile";
import { getProfileImageUrl } from "@/utils/profileImgUtils";

import { useProfileStore } from "@/store/useProfileStore";

type Props = {
  id: number;
  isOpen: boolean;
  onClose: () => void;
  onSidebarClose?: () => void;
  isOwnProfile?: boolean;
};

const ProfileModal = ({
  id,
  isOpen,
  onClose,
  onSidebarClose,
  isOwnProfile = false,
}: Props) => {
  const { data: profileResponse, isLoading, error } = useOtherProfile(id);
  const { profile: ownProfile } = useProfileStore();
  const profile = isOwnProfile ? ownProfile : profileResponse?.result;
  const navigate = useNavigate();
  const { logout } = useAuth();

  console.log(
    "ProfileModal - isOwnProfile:",
    isOwnProfile,
    "profile:",
    profile
  );

  // 모달 호버 상태 관리
  const hideModalTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 모달 호버 핸들러
  const handleModalMouseEnter = () => {
    if (hideModalTimerRef.current) {
      clearTimeout(hideModalTimerRef.current);
      hideModalTimerRef.current = null;
    }
  };

  const handleModalMouseLeave = () => {
    onClose();
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (hideModalTimerRef.current) {
        clearTimeout(hideModalTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="bg-white rounded-[8px] shadow-lg border border-gray-20 w-[345px]"
      onClick={e => e.stopPropagation()}
      onMouseEnter={handleModalMouseEnter}
      onMouseLeave={handleModalMouseLeave}
    >
      {!isOwnProfile && isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-50">로딩 중...</div>
        </div>
      ) : !isOwnProfile && error ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-50">프로필을 불러올 수 없습니다.</div>
        </div>
      ) : profile ? (
        <div>
          {/* 프로필 정보 섹션 */}
          <div className="flex gap-4 px-6 py-4">
            {/* 프로필 이미지 */}
            <div className="w-20 h-20 rounded-[8px] overflow-hidden flex-shrink-0 aspect-square">
              <img
                src={getProfileImageUrl(profile.profile_image_url)}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/src/assets/svgs/common/profile.svg";
                }}
              />
            </div>

            {/* 이름 및 직책 정보 */}
            <div className="min-w-0 flex flex-col justify-center">
              <div className="text-heading3-sb text-gray-80 mb-2">
                {profile.name}
              </div>
              <div className="text-detail1 text-gray-80 mb-1">
                {profile.team_name}
              </div>
              <div className="text-detail3 text-gray-60">
                {profile.group_name} &gt; {profile.division_name}
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-20" />

          {/* 연락처 정보 */}
          <div className="px-6 py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-gray-40" />
                <span className="text-detail1-m text-gray-80">
                  {profile.email}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-gray-40" />
                <span className="text-detail1-m text-gray-80">
                  {profile.phone_number}
                </span>
              </div>
            </div>

            {/* 조건부 버튼 렌더링 */}
            {isOwnProfile ? (
              /* 로그아웃 버튼 */
              <button
                className="w-full flex items-center cursor-pointer justify-center gap-2 py-3 px-4 border border-gray-20 rounded-[8px] bg-white hover:bg-gray-10 transition-colors"
                onClick={async e => {
                  e.stopPropagation();
                  await logout();
                  onClose();
                  navigate("/login");
                }}
              >
                <Logout className="w-4 h-4 text-gray-40" />
                <span className="text-detail1 text-gray-80 cursor-pointer">
                  Logout
                </span>
              </button>
            ) : (
              /* 스페이스 방문 버튼 */
              <button
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-20 rounded-[8px] bg-white hover:bg-gray-10 transition-colors"
                onClick={e => {
                  e.stopPropagation();
                  if (profile) {
                    navigate(`/space/${profile.name}`);
                    onClose();
                    onSidebarClose?.(); // 사이드바 닫기
                  }
                }}
              >
                <User className="w-4 h-4 text-gray-40" />
                <span className="text-detail1 text-gray-80 cursor-pointer">
                  {profile.name}님 스페이스 방문하기
                </span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-50">프로필 정보가 없습니다.</div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
