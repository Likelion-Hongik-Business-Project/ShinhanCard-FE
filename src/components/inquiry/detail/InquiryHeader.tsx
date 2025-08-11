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
}: InquiryHeaderProps) => {
  const { addScrap, removeScrap } = useScrapApi();

  const [scraped, setScraped] = useState(!!inquiry.is_scraped);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  useEffect(() => {
    setScraped(!!inquiry.is_scraped);
    // TODO: 실제 API에서 notification_enabled 값을 가져와서 설정
    // setIsNotificationEnabled(!!inquiry.notification_enabled);
    setIsNotificationEnabled(true); // 임시로 기본값 true 설정
  }, [inquiry.is_scraped]);

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

  // 알림 수신 설정 토글 핸들러
  const handleToggleNotification = async () => {
    const newState = !isNotificationEnabled;
    setIsNotificationEnabled(newState);

    try {
      // TODO: 실제 알림 설정 API 호출
      console.log(
        `알림 수신 ${newState ? "활성화" : "비활성화"} - 문의 ID: ${inquiry.inquiry_id}`
      );
    } catch {
      // 실패 시 상태 롤백
      setIsNotificationEnabled(!newState);
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
