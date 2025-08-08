import InboxEmpty from "@/components/inbox/InboxEmpty";
import InboxItem from "@/components/inbox/InboxItem";
import { formatDateGroupLabel } from "@/utils/dateUtils";
import { Tab } from "@/types/inbox";
import { NotificationItem } from "@/types/inbox/inboxApi.type";

import "@/styles/scrollbar.css";

type Props = {
  inquiries: NotificationItem[];
  tab: Tab;
};

const InboxList = ({ inquiries, tab }: Props) => {
  if (inquiries.length === 0) {
    return <InboxEmpty tab={tab} />;
  }

  // 날짜별로 묶기
  const grouped = inquiries.reduce<Record<string, NotificationItem[]>>(
    (acc, cur) => {
      const label = formatDateGroupLabel(cur.created_at);
      if (!acc[label]) acc[label] = [];
      acc[label].push(cur);
      return acc;
    },
    {}
  );

  return (
    <ul className="flex flex-col custom-scrollbar overflow-y-auto pr-[12px] pb-10 -mr-[20px] h-[calc(100%-116px)]">
      {Object.entries(grouped).map(([label, items]) => (
        <div key={label} className="flex flex-col gap-[14px] mt-10">
          <div className="text-body1 text-gray-40">{label}</div>
          {items.map(inquiry => (
            <InboxItem
              key={inquiry.notification_id}
              inquiry={inquiry}
              isArchived={tab === "보관함"}
            />
          ))}
        </div>
      ))}
    </ul>
  );
};

export default InboxList;
