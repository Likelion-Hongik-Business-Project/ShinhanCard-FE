import { useState } from "react";

import { Bubble, UserProfile } from "@/assets/svgs/followup";
import ProfileModal from "@/components/common/ProfileModal";
import { formatDateToKorean } from "@/utils/dateUtils";
import { FollowUpAuthor, TaggedUser } from "@/types/inquiryTypes";

export interface UserInfo {
  name: string;
  profile_image_url: string;
}

export type Props = {
  taggedUser: TaggedUser;
  author: FollowUpAuthor;
  created_at: string; // ISO 포맷 문자열
  content: string; // Markdown / 개행 포함 텍스트
  canEdit: boolean; // "수정" 버튼 노출 여부
  onAnswer: () => void;
  onEdit: () => void;
};

export const FollowupBody = ({
  taggedUser,
  author,
  created_at,
  content,
  canEdit,
  onAnswer,
  onEdit,
}: Props) => {
  // 프로필 모달 상태
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalOffset, setProfileModalOffset] = useState<{
    left: number;
    top: number;
  } | null>(null);

  // 프로필 호버 핸들러
  const handleProfileHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const modalHeight = 242; // ProfileModal의 대략적인 높이

    let top = rect.bottom + 8;

    // 모달이 화면 아래로 넘어가면 위로 붙이기
    if (top + modalHeight > window.innerHeight) {
      top = rect.top - modalHeight - 8;
    }

    setProfileModalOffset({
      left: rect.left,
      top: Math.max(top, 0),
    });
    setIsProfileModalOpen(true);
  };

  const handleProfileLeave = () => {
    // ProfileModal 내부에서 호버 상태를 관리하므로 즉시 닫지 않음
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        {/* 헤더: 프로필 · 이름 · 날짜 */}
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onMouseEnter={handleProfileHover}
            onMouseLeave={handleProfileLeave}
          >
            {author.profile_url ? (
              <img
                src={author.profile_url}
                alt={author.username}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <UserProfile className="w-5 h-5 rounded-full" />
            )}
            <span className="text-body1-b text-gray-100">
              {author.username}
            </span>
          </div>
          <span className="text-detail2 text-gray-50">
            {formatDateToKorean(created_at, { showTime: true })}
          </span>
        </div>

        {/* 본문 */}
        <div className="text-body2 text-gray-800 whitespace-pre-wrap">
          <span className="text-body2-b text-state-progress-02">
            {taggedUser.username + " "}
          </span>
          {content}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-4">
          <button
            onClick={onAnswer}
            className="flex gap-1 items-center cursor-pointer"
          >
            <Bubble className="w-4 h-4" />
            <span className="text-body2 text-gray-60">답변</span>
          </button>
          {canEdit && (
            <button onClick={onEdit} className="cursor-pointer">
              <span className="text-body2 text-gray-40">수정</span>
            </button>
          )}
        </div>
      </div>

      {/* 프로필 모달 */}
      {isProfileModalOpen && profileModalOffset && (
        <div
          className="fixed z-2000 transition-all duration-200 ease-in-out"
          style={{
            left: profileModalOffset.left,
            top: profileModalOffset.top,
          }}
        >
          <ProfileModal
            id={author.user_id}
            isOpen={true}
            onClose={() => {
              setIsProfileModalOpen(false);
              setProfileModalOffset(null);
            }}
          />
        </div>
      )}
    </>
  );
};

export default FollowupBody;
