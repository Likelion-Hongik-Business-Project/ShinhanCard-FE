import Bell from "@/assets/svgs/inbox/inbox-bell.svg";
import Box from "@/assets/svgs/inbox/inbox-box.svg";
import { Tab } from "@/types/inbox/inbox.type";

type Props = {
  tab: Tab;
};

const InboxEmpty = ({ tab }: Props) => {
  const isInbox = tab === "전체";

  return (
    <div className="mt-30 flex flex-col items-center justify-center text-gray-40 gap-6 text-heading2-b">
      {isInbox ? <Bell className="w-20 h-20" /> : <Box className="w-20 h-20" />}
      <p>{isInbox ? "수신된 알림이 없습니다" : "보관함이 비어 있습니다"}</p>
    </div>
  );
};

export default InboxEmpty;
