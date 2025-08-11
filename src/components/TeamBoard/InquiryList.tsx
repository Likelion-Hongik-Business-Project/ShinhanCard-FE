import { useState } from "react";

import InquiryItem from "@/components/TeamBoard/InquiryItem";
import { Inquiry } from "@/types/teamInquires/teamInquiresApi.type";

interface Props {
  //부모로부터 받는 팀 정보 props를 옵셔널로 변경
  group_name?: string;
  division_name?: string;
  team_name?: string;
  inquiries: Inquiry[];
}

const InquiryList = ({
  group_name,
  division_name,
  team_name,
  inquiries,
}: Props) => {
  // 하나의 문의글만 토글
  const [openId, setOpenId] = useState<number | null>(null);

  // 문의 글 토글
  const handleToggleOpen = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <ul className="flex-1 divide-y divide-gray-10 overflow-auto scrollbar-hide">
      {inquiries.map(inq => (
        <InquiryItem
          key={inq.inquiry_id}
          // 2. 각 inquiry 객체의 팀 정보를 우선 사용하고, 없으면 부모 prop 사용
          group_name={inq.group_name || group_name || ""}
          division_name={inq.division_name || division_name || ""}
          team_name={inq.team_name || team_name || ""}
          inquiry={inq}
          isOpen={openId === inq.inquiry_id}
          onToggleOpen={handleToggleOpen}
          isScraped={inq.is_scraped}
        />
      ))}
    </ul>
  );
};

export default InquiryList;
