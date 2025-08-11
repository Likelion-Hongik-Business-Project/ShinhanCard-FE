import { useCallback, useState } from "react";

import { useNavigate } from "react-router-dom";

import Profile from "@/assets/svgs/common/profile.svg";
import Bell from "@/assets/svgs/inbox/bell.svg";
import Check from "@/assets/svgs/inbox/check.svg";
import CheckBox from "@/assets/svgs/inbox/check-box.svg";
import Box from "@/assets/svgs/inbox/inbox-box.svg";
import Reset from "@/assets/svgs/inbox/reset.svg";
import UnCheckBox from "@/assets/svgs/inbox/uncheck-box.svg";
import Warning from "@/assets/svgs/inbox/warning.svg";
import {
  usePatchArchiveNotificationApi,
  usePatchReadNotificationApi,
} from "@/hooks/inbox/useInboxApi";
import { formatTime } from "@/utils/dateUtils";
import { getInquiryTypeFromText } from "@/utils/inboxMapping";
import { NotificationItem } from "@/types/inbox/inboxApi.type";

type Props = {
  inquiry: NotificationItem;
  isArchived?: boolean;
};

const InboxItem = ({ inquiry, isArchived }: Props) => {
  const { writer, notification_title, notification_body, created_at } = inquiry;
  const type = getInquiryTypeFromText(inquiry.notification_title);
  const [isChecked, setIsChecked] = useState(inquiry.is_read);
  const { mutate: markRead } = usePatchReadNotificationApi();
  const { mutate: archive, isPending: archiving } =
    usePatchArchiveNotificationApi();
  const navigate = useNavigate();

  const handleCheckToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const next = !isChecked;
    setIsChecked(next); // 로컬 즉시 반영: 낙관적 업데이트
    markRead(
      { notification_id: inquiry.notification_id, is_read: next },
      { onError: () => setIsChecked(prev => !prev) } // 실패 시 롤백
    );
  };

  const handleArchive = useCallback(
    (e: React.MouseEvent, next: boolean) => {
      e.stopPropagation();
      if (archiving) return; // 중복 방지
      archive({ notification_id: inquiry.notification_id, is_archived: next });
    },
    [archive, inquiry.notification_id, archiving]
  );

  const handleNavigate = async () => {
    if (!isChecked) setIsChecked(true); // ← 즉시 점 제거 (낙관적 업데이트)
    try {
      await markRead({
        notification_id: inquiry.notification_id,
        is_read: true,
      });
    } finally {
      if (inquiry.inquiry_id != null) {
        navigate(`/teams/${inquiry.team_id}/inquiries/${inquiry.inquiry_id}`);
      }
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "ANSWER_COMPLETED":
        return <Check className="w-10 h-10" />;
      case "RE_NOTIFY":
        return <Bell className="w-10 h-10" />;
      case "REPLIED":
        return <Bell className="w-10 h-10" />;
      case "PENDING":
        return <Warning className="w-10 h-10" />;
      case "DELETED":
        return <Warning className="w-10 h-10" />;
      default:
        return writer?.profile_image_url ? (
          <img
            src={writer.profile_image_url}
            alt={writer.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <Profile className="w-10 h-10" />
        );
    }
  };

  return (
    <li
      onClick={handleNavigate}
      className="group flex mt-2 w-full cursor-pointer bg-white transition duration-100 hover:bg-gray-10 rounded-[15px] py-4 pl-2 pr-4 items-center"
    >
      {renderIcon()}
      <div className="flex ml-4 w-full justify-between items-center">
        <div className="flex flex-col gap-2 w-[319px]">
          <p className="text-body2 text-gray-80 truncate">
            {notification_title}
          </p>
          <p className="text-detail1 text-gray-40 transition duration-100 group-hover:text-gray-60 truncate">
            {notification_body}
          </p>
        </div>

        <div className="flex w-15 items-center">
          {/* 기본 상태 */}
          <div className="group-hover:hidden transition flex gap-4 items-center">
            <p className="text-detail1 text-gray-30">
              {formatTime(created_at)}
            </p>
            {!isChecked && <div className="w-2 h-2 bg-main rounded-full" />}
          </div>

          {/* hover 상태일 때만 표시 */}
          {isArchived ? (
            <div className="hidden transition group-hover:flex w-[32px] ml-auto h-[32px] items-center bg-white border border-gray-20 rounded-[8px] p-1">
              <div
                onClick={e => handleArchive(e, false)}
                className="group/reset relative w-6 h-6 bg-white transition duration-100 hover:bg-gray-10 active:bg-gray-20 flex justify-center items-center rounded-[5px]"
              >
                <Reset className="w-4 h-auto transition duration-100 text-gray-50 hover:text-gray-70" />
                <div className="absolute bottom-8 h-[22px] px-2 bg-main-dark rounded-[8px] flex justify-center items-center opacity-0 group-hover/reset:opacity-100 z-10">
                  <span className="text-detail3 text-white whitespace-nowrap">
                    보관 취소
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden transition group-hover:flex w-full h-[32px] items-center justify-between bg-white border border-gray-20 rounded-[8px] p-1 gap-1">
              <div
                onClick={handleCheckToggle}
                className="group/check relative w-6 h-6 bg-white transition duration-100 hover:bg-gray-10 active:bg-gray-20 flex justify-center items-center rounded-[5px]"
              >
                {isChecked ? (
                  <UnCheckBox className="w-4 h-auto transition duration-100 text-gray-50 hover:text-gray-70" />
                ) : (
                  <CheckBox className="w-4 h-auto transition duration-100 text-gray-50 hover:text-gray-70" />
                )}
                <div className="absolute bottom-8 h-[22px] px-2 bg-main-dark rounded-[8px] flex justify-center items-center opacity-0 group-hover/check:opacity-100 z-10">
                  <span className="text-detail3 text-white whitespace-nowrap">
                    {isChecked ? "읽지 않음 표시" : "읽음 표시"}
                  </span>
                </div>
              </div>
              <div
                onClick={e => handleArchive(e, true)}
                className="group/box relative w-6 h-6 bg-white transition duration-100 hover:bg-gray-10 active:bg-gray-20 flex justify-center items-center rounded-[5px]"
              >
                <Box className="w-4 h-auto transition duration-100 text-gray-50 hover:text-gray-70" />
                <div className="absolute transition duration-100 bottom-8 h-[22px] px-2 bg-main-dark rounded-[8px] flex justify-center items-center opacity-0 group-hover/box:opacity-100 z-10">
                  <span className="text-detail3 text-white whitespace-nowrap">
                    알림 보관
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default InboxItem;
