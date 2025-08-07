import BellOff from "@/assets/svgs/inquiry/detail/bell-off.svg";
import BellOn from "@/assets/svgs/inquiry/detail/bell-on.svg";
import Star from "@/assets/svgs/inquiry/detail/star.svg";
import StarActive from "@/assets/svgs/inquiry/detail/star-active.svg";
import { useScrapApi } from "@/hooks/scrap/useScrapApi";
import { InquiryHeaderProps } from "@/types/inquiryTypes";

const InquiryHeader = ({
  finalStateLabel,
  finalStatusConfig,
  isWriter,
  isAdmin,
  canSendNotification,
  inquiry,
}: InquiryHeaderProps) => {
  const { postScrapMutation, deleteScrapMutation } = useScrapApi();

  // 스크랩 토글 핸들러
  const handleToggleScrap = async () => {
    try {
      if (inquiry.is_scraped || false) {
        await deleteScrapMutation.mutateAsync({
          inquiry_id: inquiry.inquiry_id,
        });
      } else {
        await postScrapMutation.mutateAsync({ inquiry_id: inquiry.inquiry_id });
      }
    } catch (error) {
      console.error("스크랩 처리 실패:", error);
    }
  };

  return (
    <div className="self-stretch flex justify-between items-center">
      <div
        className={`h-[32px] pl-[8px] pr-[12px] rounded-[30px] flex justify-start items-center gap-[8px] 
          ${finalStatusConfig.bg} ${finalStatusConfig.border || ""}`}
      >
        <div
          className={`w-[8px] h-[8px] ${finalStatusConfig.dot} rounded-full`}
        />
        <div className={`justify-start ${finalStatusConfig.text} text-body1`}>
          {finalStateLabel}
        </div>
      </div>

      <div className="flex justify-end items-center gap-[16px]">
        {/* 기본 알림 버튼 (문의자가 아닌 경우에만) */}
        {!isWriter && !isAdmin && (
          <button className="w-[20px] h-[20px] relative cursor-pointer">
            <BellOff className="text-gray-30" />
          </button>
        )}

        {/* 문의자 알림 발송 버튼 */}
        {isWriter && (
          <button
            disabled={!canSendNotification}
            className="w-[20px] h-[20px] relative cursor-pointer disabled:opacity-50"
          >
            {canSendNotification ? (
              <BellOn className="text-main" />
            ) : (
              <BellOff className="text-gray-30" />
            )}
          </button>
        )}

        {/* 스크랩 버튼 (팀관리자가 아닌 경우에만) */}
        {!isAdmin && (
          <button
            onClick={handleToggleScrap}
            className="w-[20px] h-[20px] relative overflow-hidden cursor-pointer"
            aria-label={inquiry.is_scraped || false ? "스크랩 취소" : "스크랩"}
          >
            {inquiry.is_scraped || false ? (
              <StarActive />
            ) : (
              <Star className="text-gray-50" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InquiryHeader;
