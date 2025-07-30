import Bell from "@/assets/svgs/inquiry/detail/bell.svg";
import Button from "@/components/common/Button";

interface NotificationButtonProps {
  isWriter: boolean;
  notificationSent: boolean;
  remainingTime: string;
}

const NotificationButton = ({
  isWriter,
  notificationSent,
  remainingTime,
}: NotificationButtonProps) => {
  if (!isWriter) return null;

  return (
    <div className="self-stretch px-[16px] justify-start items-start flex">
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
