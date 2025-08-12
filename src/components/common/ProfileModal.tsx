import { useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import ProfileIcon from "@/assets/svgs/common/profile.svg";
import User from "@/assets/svgs/home/icon-user.svg";
import Logout from "@/assets/svgs/profile/logout.svg";
import Mail from "@/assets/svgs/profile/mail.svg";
import Phone from "@/assets/svgs/profile/phone.svg";
import { useAuth } from "@/hooks/auth/useAuth";
import { useOutsideClick } from "@/hooks/common/useOutsideClick";
import { useOtherProfile } from "@/hooks/profile/useOtherProfile";

import { useProfileStore } from "@/store/useProfileStore";

type Props = {
  id: number;
  isOpen: boolean;
  onClose: () => void;
  onSidebarClose?: () => void;
};

const ProfileModal = ({ id, isOpen, onClose, onSidebarClose }: Props) => {
  const { data: profileResponse, isLoading, error } = useOtherProfile(id);
  const { profile: ownProfile } = useProfileStore();

  // 현재 사용자의 프로필인지 자동으로 판단
  const isOwnProfile = ownProfile?.id === id;
  const profile = isOwnProfile ? ownProfile : profileResponse?.result;

  const navigate = useNavigate();
  const { logout } = useAuth();

  // 모달 ref
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 호버 상태 관리
  const hideModalTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 외부 클릭 시 모달 닫기
  useOutsideClick(modalRef, () => {
    onClose();
  });

  // 모달 호버 핸들러
  const handleModalMouseEnter = () => {
    if (hideModalTimerRef.current) {
      clearTimeout(hideModalTimerRef.current);
      hideModalTimerRef.current = null;
    }
  };

  const handleModalMouseLeave = () => {
    // 모달에서 마우스가 벗어날 때 약간의 지연 후 닫기
    hideModalTimerRef.current = setTimeout(() => {
      onClose();
    }, 100);
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
      ref={modalRef}
      className="bg-white rounded-[8px] shadow-lg border border-gray-20 w-[345px]"
      onClick={e => e.stopPropagation()}
      onMouseEnter={handleModalMouseEnter}
      onMouseLeave={handleModalMouseLeave}
    >
      {!isOwnProfile && isLoading ? (
        <div className="flex items-center justify-center h-32"></div>
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
              {profile.profile_image_url?.trim() ? (
                <img
                  src={profile.profile_image_url.trim()}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ProfileIcon className="w-full h-full" />
              )}
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
                    navigate(`/space/${profile.id}`);
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
