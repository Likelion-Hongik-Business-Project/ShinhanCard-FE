import { useNavigate, useParams } from "react-router-dom";

import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import { formatDateToKorean } from "@/utils/dateUtils";
import { InquiryContentProps } from "@/types/inquiryTypes";

const InquiryContent = ({
  title,
  content,
  author,
  createdAt,
  isWriter,
  isAdmin,
  answersCount,
  onDelete,
}: InquiryContentProps) => {
  const navigate = useNavigate();
  const { team_id, inquiry_id } = useParams<{
    team_id: string;
    inquiry_id: string;
  }>();

  // 수정 페이지로 이동하는 핸들러
  const handleEdit = () => {
    navigate(`/teams/${team_id}/inquiries/${inquiry_id}/edit`);
  };

  return (
    <div className="self-stretch px-[16px] flex flex-col justify-start items-start gap-[32px]">
      {/* 제목 */}
      <div className="flex justify-start items-start gap-[24px]">
        <div className="justify-start text-gray-100 text-heading2-b">
          {title}
        </div>
      </div>

      {/* 내용 */}
      <div className="self-stretch justify-start text-gray-100 text-body2 whitespace-pre-line">
        {content}
      </div>

      {/* 작성자 정보 */}
      <div className="self-stretch rounded-[30px] flex flex-col justify-center items-start gap-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            {author.profile_image_url ? (
              <img
                src={author.profile_image_url}
                alt={`${author.user_name}의 프로필 이미지`}
                className="w-[20px] h-[20px] rounded-full"
              />
            ) : (
              <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
            )}
            <div className="text-gray-80 text-body1-b">{author.user_name}</div>
            <div className="text-main text-detail1-b mt-[1px]">
              {author.team_name}
            </div>
          </div>
          {/* 문의자 수정/삭제 버튼 */}
          {isWriter && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleEdit}
                className="text-gray-50 text-body2 cursor-pointer"
              >
                수정
              </button>
              {(answersCount === 0 || isAdmin) && (
                <button
                  onClick={onDelete}
                  className="text-gray-50 text-body2 cursor-pointer"
                >
                  삭제
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-start items-center gap-[32px]">
          <div className="justify-start text-gray-50 text-detail1">
            {formatDateToKorean(createdAt, { showTime: true })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryContent;
