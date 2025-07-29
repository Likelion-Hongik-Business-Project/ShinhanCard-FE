import Profile from "@/assets/svgs/common/profile.svg";
import Bell from "@/assets/svgs/inbox/bell.svg";
import Check from "@/assets/svgs/inbox/check.svg";
import Warning from "@/assets/svgs/inbox/warning.svg";
import { formatTime } from "@/utils/dateUtils";
import { getInquiryTypeFromText } from "@/utils/inboxMapping";
import { Inquiry } from "@/types/inbox";

type Props = {
  inquiry: Inquiry;
};

const InboxItem = ({ inquiry }: Props) => {
  const { writer, notification_text, notification_description, created_at } =
    inquiry;
  const type = getInquiryTypeFromText(inquiry.notification_text);

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
    <li className="flex mt-2 w-full cursor-pointer bg-white hover:bg-gray-10 rounded-[15px] py-4 pl-2 pr-4 items-center">
      {renderIcon()}
      <div className="flex ml-4 w-full justify-between items-center">
        <div className="flex flex-col gap-2 w-[312px]">
          <p className="text-body2 text-gray-80 truncate">
            {notification_text}
          </p>
          <p className="text-detail1 text-gray-60 truncate">
            {notification_description}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <p className="text-detail1 text-gray-30">{formatTime(created_at)}</p>
          <div className="w-2 h-2 bg-main rounded-full" />
        </div>
      </div>
    </li>
  );
};

export default InboxItem;
