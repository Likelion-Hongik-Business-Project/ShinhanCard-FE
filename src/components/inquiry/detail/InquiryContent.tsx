import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import { formatDateToKorean } from "@/utils/formatDateToKorean";

interface InquiryContentProps {
  title: string;
  content: string;
  writer: {
    user_id: number;
    name: string;
    profile_image_url?: string;
  };
  createdAt: string;
  isWriter: boolean;
  isAdmin: boolean;
  answersCount: number;
}

const InquiryContent = ({
  title,
  content,
  writer,
  createdAt,
  isWriter,
  isAdmin,
  answersCount,
}: InquiryContentProps) => {
  return (
    <div className="self-stretch px-[16px] flex flex-col justify-start items-start gap-[32px]">
      {/* 제목 */}
      <div className="flex justify-start items-start gap-[24px]">
        <div className="justify-start text-gray-100 text-heading2">{title}</div>
      </div>

      {/* 내용 */}
      <div className="self-stretch justify-start text-gray-100 text-body2 whitespace-pre-line">
        {content}
      </div>

      {/* 작성자 정보 */}
      <div className="self-stretch rounded-[30px] flex flex-col justify-center items-start gap-[16px]">
        <div className="flex justify-start items-center gap-[8px] w-full">
          <div className="flex justify-start items-center gap-[8px]">
            <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
            <div className="flex justify-start items-start gap-[24px]">
              <div className="justify-start text-gray-80 text-body1">
                {writer.name}
              </div>
            </div>
          </div>
          <div className="justify-start text-main text-detail1">
            Core 개발 2부
          </div>

          {/* 문의자 수정/삭제 버튼 */}
          {isWriter && (
            <div className="flex items-center gap-[16px] ml-auto">
              <button className="text-gray-50 text-body2">수정</button>
              {/* 답변이 없거나 관리자가 아닌 경우에만 삭제 버튼 표시 */}
              {(answersCount === 0 || isAdmin) && (
                <button className="text-gray-50 text-body2">삭제</button>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-start items-center gap-[32px]">
          <div className="justify-start text-gray-50 text-detail1">
            {formatDateToKorean(createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryContent;
