import InboxEmpty from "@/components/inbox/InboxEmpty";
import InboxItem from "@/components/inbox/InboxItem";
import { formatDateGroupLabel } from "@/utils/dateUtils";
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

  // 날짜별로 묶기
  const grouped = inquiries.reduce<Record<string, Inquiry[]>>((acc, cur) => {
    const label = formatDateGroupLabel(cur.created_at);
    if (!acc[label]) acc[label] = [];
    acc[label].push(cur);
    return acc;
  }, {});

  return (
    <ul className="flex flex-col gap-4 custom-scrollbar overflow-y-auto pr-[14px] pb-10 -mr-[22px] h-[calc(100%-116px)]">
      {Object.entries(grouped).map(([label, items]) => (
        <div key={label} className="flex flex-col gap-[14px] mt-10">
          <div className="text-body2 text-gray-40">{label}</div>
          {items.map(inquiry => (
            <InboxItem
              key={inquiry.id}
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
