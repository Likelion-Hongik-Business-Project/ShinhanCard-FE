import Bell from "@/assets/svgs/inbox/bell.svg";
import Check from "@/assets/svgs/inbox/check.svg";
import Warning from "@/assets/svgs/inbox/warning.svg";
import { getInquiryTypeFromText } from "@/utils/inboxMapping";
import { Inquiry } from "@/types/inbox";

type Props = {
  inquiry: Inquiry;
};

const InboxItem = ({ inquiry }: Props) => {
  const { writer, notification_text, created_at } = inquiry;
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
        return (
          <img
            src={writer.profile_image_url}
            alt={writer.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        );
    }
  };

  return (
    <li className="flex gap-3 items-center py-3 border-b border-gray-20">
      {renderIcon()}
      <div className="flex flex-col">
        <p className="text-body1 text-gray-90">{notification_text}</p>
        <p className="text-caption2 text-gray-50">
          {new Date(created_at).toLocaleString()}
        </p>
      </div>
    </li>
  );
};

export default InboxItem;
