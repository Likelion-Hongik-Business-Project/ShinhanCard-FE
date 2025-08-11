import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import { formatDateToKorean } from "@/utils/dateUtils";
import type { AnswerItemProps } from "@/types/inquiryTypes";

const AnswerItem = ({
  comment,
  isOnlyComment,
  currentUserId,
  onStartEdit,
  onDelete,
}: AnswerItemProps) => {
  const isWriter = comment.user?.user_id === currentUserId;

  if (!comment.user) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="whitespace-pre-line px-4 py-8 text-body2 text-gray-100">
        {comment.content}
      </div>
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
                  onClick={() => onDelete(comment.comment_id)}
                >
                  삭제
                </button>
              )}
            </div>
          )}
        </div>
        {/* 작성 시간 */}
        <div className="text-detail1 text-gray-50">
          {formatDateToKorean(comment.created_at, { showTime: true })}
        </div>
      </div>
    </div>
  );
};

export default AnswerItem;
