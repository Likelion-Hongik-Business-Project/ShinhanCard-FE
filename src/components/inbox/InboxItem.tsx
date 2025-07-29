import { useState } from "react";

import Profile from "@/assets/svgs/common/profile.svg";
import Bell from "@/assets/svgs/inbox/bell.svg";
import Check from "@/assets/svgs/inbox/check.svg";
import CheckBox from "@/assets/svgs/inbox/check-box.svg";
import Box from "@/assets/svgs/inbox/inbox-box.svg";
import Reset from "@/assets/svgs/inbox/reset.svg";
import UnCheckBox from "@/assets/svgs/inbox/uncheck-box.svg";
import Warning from "@/assets/svgs/inbox/warning.svg";
import { formatTime } from "@/utils/dateUtils";
import { getInquiryTypeFromText } from "@/utils/inboxMapping";
import { Inquiry } from "@/types/inbox";

type Props = {
  inquiry: Inquiry;
  isArchived?: boolean;
};

const InboxItem = ({ inquiry, isArchived }: Props) => {
  const { writer, notification_text, notification_description, created_at } =
    inquiry;
  const type = getInquiryTypeFromText(inquiry.notification_text);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckToggle = () => {
    setIsChecked(prev => !prev);
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
        return writer.profile_image_url ? (
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
    <li className="group flex mt-2 w-full cursor-pointer bg-white transition duration-100 hover:bg-gray-10 rounded-[15px] py-4 pl-2 pr-4 items-center">
      {renderIcon()}
      <div className="flex ml-4 w-full justify-between items-center">
        <div className="flex flex-col gap-2 w-[319px]">
          <p className="text-body2 text-gray-80 truncate">
            {notification_text}
          </p>
          <p className="text-detail1 text-gray-60 truncate">
            {notification_description}
          </p>
        </div>

        <div className="flex w-15 items-center">
          {/* 기본 상태 */}
          <div className="group-hover:hidden transition flex gap-4 items-center">
            <p className="text-detail1 text-gray-30">
              {formatTime(created_at)}
            </p>
            {!isChecked && !isArchived && (
              <div className="w-2 h-2 bg-main rounded-full" />
            )}
          </div>

          {/* hover 상태일 때만 표시 */}
          {isArchived ? (
            <div className="hidden transition group-hover:flex w-[32px] ml-auto h-[32px] items-center bg-white border border-gray-20 rounded-[8px] p-1">
              <div className="w-6 h-6 bg-white transition duration-100 hover:bg-gray-10 active:bg-gray-20 flex justify-center items-center rounded-[5px]">
                <Reset className="w-4 h-auto transition duration-100 text-gray-50 hover:text-gray-70" />
              </div>
            </div>
          ) : (
            <div className="hidden transition group-hover:flex w-full h-[32px] items-center justify-between bg-white border border-gray-20 rounded-[8px] p-1 gap-1">
              <div
                onClick={handleCheckToggle}
                className="w-6 h-6 bg-white transition duration-100 hover:bg-gray-10 active:bg-gray-20 flex justify-center items-center rounded-[5px]"
              >
                {isChecked ? (
                  <CheckBox className="w-4 h-auto transition duration-100 text-gray-50 hover:text-gray-70" />
                ) : (
                  <UnCheckBox className="w-4 h-auto transition duration-100 text-gray-50 hover:text-gray-70" />
                )}
              </div>
              <div className="w-6 h-6 bg-white transition duration-100 hover:bg-gray-10 active:bg-gray-20 flex justify-center items-center rounded-[5px]">
                <Box className="w-4 h-auto transition duration-100 text-gray-50 hover:text-gray-70" />
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default InboxItem;
