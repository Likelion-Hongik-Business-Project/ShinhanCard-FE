import { useState } from "react";

import clsx from "clsx";

import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import MarkdownViewer from "@/components/common/MarkdownViewer";
import Modal from "@/components/common/Modal";
import ProfileModal from "@/components/common/ProfileModal";
import { formatDateToKorean } from "@/utils/dateUtils";
import type { AnswerItemProps } from "@/types/inquiryTypes";

import FileDownloadBox from "../FileDownloadBox";

const AnswerItem = ({
  comment,
  isOnlyComment,
  currentUserId,
  onStartEdit,
  onDelete,
}: AnswerItemProps) => {
  const isWriter = comment.user?.user_id === currentUserId;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 프로필 모달 상태
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalOffset, setProfileModalOffset] = useState<{
    left: number;
    top: number;
  } | null>(null);

  if (!comment.user) return null;

  const openDeleteModal = () => setIsDeleteOpen(true);
  const closeDeleteModal = () => setIsDeleteOpen(false);
  const confirmDelete = () => {
    onDelete(comment.answer_id);
    closeDeleteModal();
  };

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
    <div className="flex w-full flex-col gap-8">
      <div className="whitespace-pre-line px-4 pt-8 text-body2 text-gray-100 ">
        <MarkdownViewer content={comment.content} />
      </div>

      {comment.files && comment.files.length > 0 && (
        <div className="w-full">
          <div
            className={clsx(
              "grid gap-3",
              "max-1680:grid-cols-1",
              "1680:grid-cols-[repeat(3,minmax(412px,1fr))]"
            )}
          >
            {comment.files.map(f => (
              <FileDownloadBox
                key={f.file_id}
                file={{
                  id: f.file_id,
                  file_name: f.file_name,
                  file_size: f.file_size ?? 0,
                  progress: 100,
                  status: "done",
                }}
                onRemove={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* 작성자 정보 */}
      <div className="self-stretch px-4 flex flex-col items-start justify-center gap-4">
        <div className="flex w-full items-center justify-between">
          {/* 작성자 프로필 */}
          <div className="flex items-center gap-[10px]">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onMouseEnter={handleProfileHover}
              onMouseLeave={handleProfileLeave}
            >
              {comment.user.profile_url ? (
                <img
                  src={comment.user.profile_url}
                  alt={`${comment.user.username}의 프로필 이미지`}
                  className="h-5 w-5 rounded-full"
                />
              ) : (
                <ProfileIcon className="h-5 w-5 rounded-full text-gray-30" />
              )}
              <span className="text-body1-b text-gray-80">
                {comment.user.username}
              </span>
            </div>
            {comment.user.team_name && (
              <span className="text-detail1-b text-main mt-[1px]">
                {comment.user.team_name}
              </span>
            )}
          </div>

          {/* 수정/삭제 버튼 */}
          {isWriter && (
            <div className="flex items-center gap-8">
              <button
                onClick={() => onStartEdit(comment)}
                className="text-body2 text-gray-50 cursor-pointer"
              >
                수정
              </button>

              {/* 유일한 댓글이 아닐 때만 삭제 버튼 노출 */}
              {!isOnlyComment && (
                <button
                  className="text-body2 text-gray-50 cursor-pointer"
                  onClick={openDeleteModal}
                >
                  삭제
                </button>
              )}
            </div>
          )}
        </div>

        {/* 작성 시간 */}
        <div className="text-detail1 text-gray-50">
          {formatDateToKorean(comment.updated_at ?? comment.created_at, {
            showTime: true,
          })}
          {comment.updated_at && <> 수정됨</>}
        </div>
      </div>

      <Modal
        isOpen={isDeleteOpen}
        title="답변을 삭제하시겠습니까?"
        onClose={closeDeleteModal}
        buttons={[
          { type: "gray", label: "취소", onClick: closeDeleteModal },
          { type: "red", label: "확인", onClick: confirmDelete },
        ]}
      />

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
            id={comment.user.user_id}
            isOpen={true}
            onClose={() => {
              setIsProfileModalOpen(false);
              setProfileModalOffset(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AnswerItem;
