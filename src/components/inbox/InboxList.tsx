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

  const grouped = inquiries.reduce<Record<string, Inquiry[]>>((acc, cur) => {
    const label = formatDateGroupLabel(cur.created_at);
    if (!acc[label]) acc[label] = [];
    acc[label].push(cur);
    return acc;
  }, {});

  return (
    <ul className="flex flex-col gap-4 custom-scrollbar overflow-y-auto pr-[14px] -mr-[22px] h-[calc(100%-150px)]">
      {Object.entries(grouped).map(([label, items]) => (
        <li key={label} className="flex flex-col gap-2">
          <div className="text-subhead2 text-gray-60">{label}</div>
          {items.map(inquiry => (
            <InboxItem key={inquiry.id} inquiry={inquiry} />
          ))}
        </li>
      ))}
    </ul>
  );
};

export default InboxList;
