import Bell from "@/assets/svgs/inquiry/detail/bell.svg";
import Button from "@/components/common/Button";
import { NotificationButtonProps } from "@/types/inquiryTypes";

const NotificationButton = ({
  isWriter,
  notificationSent,
  remainingTime,
  finalStateLabel,
}: NotificationButtonProps) => {
  // 문의자가 아니거나, 답변완료/등록보류 상태면 표시하지 않음
  if (!isWriter || ["답변 완료", "등록 보류"].includes(finalStateLabel)) {
    return null;
  }

  return (
    <div className="flex justify-start items-start">
      {notificationSent ? (
        // 알림 보낸 후
        <Button buttonType="done" className="border-gray-20 text-gray-60">
          <Bell className="w-[20px] h-[20px] text-gray-60" />
          <span>담당자 알림 발송 ({remainingTime || "대기중"})</span>
        </Button>
      ) : (
        // 알림 보내기 전
        <Button buttonType="default" className="text-gray-80 hover:bg-gray-10">
          <Bell className="w-[20px] h-[20px] text-gray-60" />
          <span>담당자 알림 발송</span>
        </Button>
      )}
    </div>
  );
};

export default NotificationButton;