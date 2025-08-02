import { useState } from "react";

import InquiryItem from "@/components/TeamBoard/InquiryItem";
import { Inquiry } from "@/types/teamBoard";

interface Props {
  //부모로부터 받는 팀 정보 props를 옵셔널로 변경
  group_name?: string;
  division_name?: string;
  team_name?: string;
  inquiries: Inquiry[]; // teamBoard의 Inquiry 타입 사용
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

  // 스크랩
  const [scrapStates, setScrapStates] = useState<Record<number, boolean>>(
    inquiries.reduce(
      (acc, item) => {
        acc[item.inquiry_id] = item.is_scrapped;
        return acc;
      },
      {} as Record<number, boolean>
    )
  );

  // 스크랩 토글
  const handleToggleScrap = (id: number) => {
    setScrapStates(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
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
          isScraped={!!scrapStates[inq.inquiry_id]}
          onToggleScrap={handleToggleScrap}
        />
      ))}
    </ul>
  );
};

export default InquiryList;
