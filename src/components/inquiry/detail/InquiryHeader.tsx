import Bell from "@/assets/svgs/inquiry/detail/bell.svg";
import BellOff from "@/assets/svgs/inquiry/detail/bell-off.svg";
import BellOn from "@/assets/svgs/inquiry/detail/bell-on.svg";
import Star from "@/assets/svgs/inquiry/detail/star.svg";

interface InquiryHeaderProps {
  finalStateLabel: string;
  finalStatusConfig: {
    bg: string;
    text: string;
    dot: string;
  };
  isWriter: boolean;
  isAdmin: boolean;
  canSendNotification: boolean;
}

const InquiryHeader = ({
  finalStateLabel,
  finalStatusConfig,
  isWriter,
  isAdmin,
  canSendNotification,
}: InquiryHeaderProps) => {
  return (
    <div className="self-stretch flex justify-between items-center">
      <div
        className={`h-[32px] pl-[8px] pr-[12px] ${finalStatusConfig.bg} rounded-[30px] flex justify-start items-center gap-[8px]`}
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
            <Bell className="text-gray-30" />
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
          <button className="w-[20px] h-[20px] relative overflow-hidden cursor-pointer">
            <Star className="text-gray-50" />
          </button>
        )}

        {/* 팀관리자 삭제 버튼 */}
        {isAdmin && (
          <button className="text-point-red text-body1 cursor-pointer">
            게시물 삭제
          </button>
        )}
      </div>
    </div>
  );
};

export default InquiryHeader;
