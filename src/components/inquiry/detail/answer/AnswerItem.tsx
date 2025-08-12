import { useState } from "react";

import clsx from "clsx";

import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import MarkdownViewer from "@/components/common/MarkdownViewer";
import Modal from "@/components/common/Modal";
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

  if (!comment.user) return null;

  const openDeleteModal = () => setIsDeleteOpen(true);
  const closeDeleteModal = () => setIsDeleteOpen(false);
  const confirmDelete = () => {
    onDelete(comment.answer_id);
    closeDeleteModal();
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
                  name: f.file_name,
                  size: f.file_size ?? 0,
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
            <div className="flex items-center gap-2">
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
        description="딥변을 삭제할 시 복구할 수 없습니다."
        onClose={closeDeleteModal}
        buttons={[
          { type: "gray", label: "취소", onClick: closeDeleteModal },
          { type: "red", label: "확인", onClick: confirmDelete },
        ]}
      />
    </div>
  );
};

export default AnswerItem;
