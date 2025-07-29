import { useState } from "react";

import ProfileIcon from "@/assets/svgs/common/profile.svg";
import Star from "@/assets/svgs/common/star.svg";
import Check from "@/assets/svgs/inquiry/detail/check.svg";
import UserCheck from "@/assets/svgs/inquiry/user-check.svg";
import Bell from "@/assets/svgs/layout/bell.svg";
import { INQUIRY_STATUS_STYLES } from "@/constants/inquiry";
import { formatDateToKorean } from "@/utils/formatDateToKorean";
import { STATUS_MAPPING } from "@/mocks/mockInquiryDetailResponse";

interface InquiryCardProps {
  inquiry: {
    inquiry_id: number;
    title: string;
    content_preview: string;
    inquiry_state: string;
    created_at: string;
    writer: {
      user_id: number;
      name: string;
      profile_image_url?: string;
    };
    assignees?: Array<{
      user_id: number;
      name: string;
      profile_image_url?: string;
    }>;
    references?: Array<{
      user_id: number;
      name: string;
      profile_image_url?: string;
    }>;
  };
}

const InquiryCard = ({ inquiry }: InquiryCardProps) => {
  const [isNotificationOn, setIsNotificationOn] = useState(false);

  // 영어 상태를 한글로 변환
  const mappedStatus =
    STATUS_MAPPING[inquiry.inquiry_state] || inquiry.inquiry_state;

  const statusConfig = INQUIRY_STATUS_STYLES?.[mappedStatus] || {
    bg: "bg-gray-20",
    text: "text-gray-60",
    dot: "bg-gray-40",
  };

  return (
    <div className="self-stretch p-[64px] bg-white rounded-[15px] flex flex-col justify-start items-start gap-[32px]">
      {/* 헤더 - 상태 및 액션 버튼 */}
      <div className="self-stretch flex justify-between items-center">
        <div
          className={`h-[32px] pl-[8px] pr-[12px] ${statusConfig.bg} rounded-[30px] flex justify-start items-center gap-[8px]`}
        >
          <div className={`w-[8px] h-[8px] ${statusConfig.dot} rounded-full`} />
          <div
            className={`justify-start ${statusConfig.text} text-[18px] font-normal font-['Pretendard'] leading-[21.60px]`}
          >
            {mappedStatus}
          </div>
        </div>
        <div className="flex justify-end items-center gap-[16px]">
          <button
            onClick={() => setIsNotificationOn(!isNotificationOn)}
            className="w-[20px] h-[20px] relative cursor-pointer"
          >
            <Bell
              className={`w-4 h-4 ${isNotificationOn ? "text-main" : "text-gray-50"}`}
            />
          </button>
          <button className="w-[20px] h-[20px] relative overflow-hidden cursor-pointer">
            <Star className="w-5 h-4 text-gray-50" />
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="self-stretch px-[16px] flex flex-col justify-start items-start gap-[32px]">
        {/* 제목 */}
        <div className="flex justify-start items-start gap-[24px]">
          <div className="justify-start text-gray-100 text-heading2 font-semibold font-['Pretendard']">
            {inquiry.title}
          </div>
        </div>

        {/* 내용 */}
        <div className="self-stretch justify-start text-gray-100 text-body2 font-normal font-['Pretendard'] whitespace-pre-line">
          {inquiry.content_preview}
        </div>

        {/* 작성자 정보 */}
        <div className="self-stretch rounded-[30px] flex flex-col justify-center items-start gap-[16px]">
          <div className="flex justify-start items-center gap-[8px]">
            <div className="flex justify-start items-center gap-[8px]">
              <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
              <div className="flex justify-start items-start gap-[24px]">
                <div className="justify-start text-gray-80 text-body1 font-bold font-['Pretendard']">
                  {inquiry.writer.name}
                </div>
              </div>
            </div>
            <div className="justify-start text-main text-detail1 font-bold font-['Pretendard']">
              Core 개발 2부
            </div>
          </div>
          <div className="flex justify-start items-center gap-[32px]">
            <div className="justify-start text-gray-50 text-detail1 font-normal font-['Pretendard']">
              {formatDateToKorean(inquiry.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="self-stretch h-0 border-t border-gray-10"></div>

      {/* 담당자 정보 */}
      <div className="px-[16px] flex flex-col justify-start items-start gap-[16px]">
        {/* 답변 담당자 */}
        <div className="flex justify-start items-center gap-[20px]">
          <div className="flex justify-start items-center gap-[8px]">
            <div className="w-[20px] h-[20px] relative overflow-hidden">
              <UserCheck className="w-[20px] h-[17px] left-0 top-[2px] absolute text-gray-40" />
            </div>
            <div className="justify-start text-gray-50 text-body2 font-normal font-['Pretendard']">
              답변 담당자
            </div>
          </div>
          <div className="w-[728px] px-[8px] py-[4px] bg-white rounded-[5px] flex justify-start items-center gap-[16px]">
            {inquiry.assignees?.map(assignee => (
              <div
                key={assignee.user_id}
                className="flex justify-start items-center gap-[4px]"
              >
                <div className="flex justify-start items-center gap-[8px]">
                  <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
                  <div className="justify-start text-gray-50 text-body2 font-normal font-['Pretendard']">
                    {assignee.name}
                  </div>
                </div>
                <div className="w-[20px] h-[20px] relative overflow-hidden">
                  <Check className="w-[20px] h-[20px] text-gray-30" />
                </div>
              </div>
            )) || (
              <div className="text-gray-50 text-body2">
                담당자가 지정되지 않았습니다
              </div>
            )}
          </div>
        </div>

        {/* 답변 참조자 */}
        <div className="flex justify-start items-center gap-[20px]">
          <div className="flex justify-start items-center gap-[8px]">
            <div className="w-[20px] h-[20px] relative overflow-hidden">
              <UserCheck className="w-[20px] h-[17px] left-0 top-[2px] absolute text-gray-40" />
            </div>
            <div className="justify-start text-gray-50 text-body2 font-normal font-['Pretendard']">
              답변 참조자
            </div>
          </div>
          <div className="w-[728px] px-[8px] py-[4px] bg-white rounded-[5px] flex justify-start items-center gap-[16px]">
            {inquiry.references?.map(reference => (
              <div
                key={reference.user_id}
                className="flex justify-start items-center gap-[6px]"
              >
                <div className="flex justify-start items-center gap-[8px]">
                  <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
                  <div className="justify-start text-gray-100 text-body2 font-normal font-['Pretendard']">
                    {reference.name}
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-gray-50 text-body2">
                참조자가 지정되지 않았습니다
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryCard;
