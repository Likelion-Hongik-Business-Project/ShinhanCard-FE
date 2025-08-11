import { useEffect, useState } from "react";

import BellOff from "@/assets/svgs/inquiry/detail/bell-off.svg";
import BellOn from "@/assets/svgs/inquiry/detail/bell-on.svg";
import Star from "@/assets/svgs/inquiry/detail/star.svg";
import StarActive from "@/assets/svgs/inquiry/detail/star-active.svg";
import { useScrapApi } from "@/hooks/scrap/useScrapApi";
import { InquiryHeaderProps } from "@/types/inquiryTypes";

const InquiryHeader = ({
  finalStateLabel,
  finalStatusConfig,
  inquiry,
  onToggleNotification,
}: InquiryHeaderProps) => {
  const { addScrap, removeScrap } = useScrapApi();

  const [scraped, setScraped] = useState(!!inquiry.is_scraped);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(
    !!inquiry.is_notification_enabled
  );

  useEffect(() => {
    setScraped(!!inquiry.is_scraped);
    setIsNotificationEnabled(!!inquiry.is_notification_enabled);
  }, [inquiry.is_scraped, inquiry.is_notification_enabled]);

  const scrapToggling = addScrap.isPending || removeScrap.isPending;

  const handleToggleScrap = async () => {
    const next = !scraped;
    setScraped(next);
    try {
      if (next) {
        await addScrap.mutateAsync(inquiry.inquiry_id);
      } else {
        await removeScrap.mutateAsync(inquiry.inquiry_id);
      }
    } catch (e) {
      setScraped(!next);
      console.error(e);
    }
  };

  // 알림 수신 설정 토글 핸들러 - 실제 API 호출
  const handleToggleNotification = async () => {
    const newState = !isNotificationEnabled;
    setIsNotificationEnabled(newState); // 즉시 UI 업데이트

    try {
      await onToggleNotification(); // 부모에서 전달받은 함수 호출
    } catch (error) {
      // 실패 시 상태 롤백
      setIsNotificationEnabled(!newState);
      console.error("알림 설정 변경 실패:", error);
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
        {/* 알림 수신 설정 토글 버튼 */}
        <button
          onClick={handleToggleNotification}
          className="w-[20px] h-[20px] relative cursor-pointer"
        >
          {isNotificationEnabled ? (
            <BellOn className="text-main" />
          ) : (
            <BellOff className="text-gray-30" />
          )}
        </button>

        {/* 스크랩 버튼 */}
        <button
          onClick={handleToggleScrap}
          disabled={scrapToggling}
          className="w-[20px] h-[20px] relative overflow-hidden cursor-pointer"
          aria-label={inquiry.is_scraped || false ? "스크랩 취소" : "스크랩"}
        >
          {scraped ? <StarActive /> : <Star className="text-gray-50" />}
        </button>
      </div>
    </div>
  );
};

export default InquiryHeader;
