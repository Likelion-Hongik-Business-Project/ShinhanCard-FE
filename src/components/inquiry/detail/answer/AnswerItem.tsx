import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import { formatDateToKorean } from "@/utils/dateUtils";
import type { AnswerItemProps } from "@/types/inquiryTypes";

const AnswerItem = ({
  comment,
  isOnlyComment,
  currentUserId,
  onStartEdit,
}: AnswerItemProps) => {
  const isWriter = comment.writer.user_id === currentUserId;

  return (
    <div className="flex flex-col gap-8">
      <div className="whitespace-pre-line px-4 text-body2 text-gray-100">
        {comment.content}
      </div>

      <div className="flex flex-col gap-4 rounded-[30px] px-4">
        <div className="flex w-full items-start justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-2">
              {comment.writer.profile_image_url ? (
                <img
                  src={comment.writer.profile_image_url}
                  alt={`${comment.writer.name}의 프로필 이미지`}
                  className="h-5 w-5 rounded-full"
                />
              ) : (
                <ProfileIcon className="h-5 w-5 rounded-full text-gray-30" />
              )}
              <span className="text-body1-b text-gray-80">
                {comment.writer.name}
              </span>
            </div>
            {comment.writer.team_name && (
              <span className="text-detail1-b text-main mt-[1px]">
                {comment.writer.team_name}
              </span>
            )}
          </div>

          {isWriter && (
            <div className="flex items-center gap-8">
              <button
                onClick={() => onStartEdit(comment.writer.user_id)}
                className="text-body2 text-gray-50"
              >
                수정
              </button>
              <button
                disabled={isOnlyComment}
                className="text-body2 text-gray-50 disabled:cursor-not-allowed disabled:text-gray-30"
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <div className="text-detail1 text-gray-50">
          {formatDateToKorean(comment.created_at, { showTime: true })}
        </div>
      </div>
    </div>
  );
};

export default AnswerItem;
