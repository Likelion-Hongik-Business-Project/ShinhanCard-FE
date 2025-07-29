import InboxEmpty from "@/components/inbox/InboxEmpty";
import { Inquiry, Tab } from "@/types/inbox";

import "@/styles/scrollbar.css";

type Props = {
  inquiries: Inquiry[];
  tab: Tab;
};

const InboxList = ({ inquiries, tab }: Props) => {
  if (inquiries.length === 0) {
    return <InboxEmpty tab={tab} />;
  }

  return (
    <ul className="flex flex-col gap-4 custom-scrollbar overflow-y-auto pr-[14px] -mr-[22px] h-[calc(100%-150px)]">
      {inquiries.map(inquiry => (
        <li
          key={inquiry.id}
          className="flex gap-3 items-center py-3 border-b border-gray-20"
        >
          {/* TODO: 보관함일 때 UI 수정 & 메시지별 UI 수정 */}
          {tab === "보관함" && <div>보관함 UI</div>}
          <img
            src={inquiry.writer.profile_image_url}
            alt={inquiry.writer.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-body1 text-gray-90">
              {inquiry.notification_text}
            </p>
            <p className="text-caption2 text-gray-50">
              {new Date(inquiry.created_at).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default InboxList;
