import InquiryItem from "@/components/TeamBoard/InquiryItem";
import { Inquiry } from "@/types/teamBoard";
import { useEffect, useRef, useState } from "react";

interface Props {
  group_name: string;
  division_name: string;
  team_name: string;
  inquiries: Inquiry[];
}

const InquiryList = ({ group_name, division_name, team_name, inquiries }: Props) => {
  const [scrapStates, setScrapStates] = useState<Record<number, boolean>>(
    inquiries.reduce(
      (acc, item) => {
        acc[item.inquiry_id] = item.is_scrapped;
        return acc;
      },
      {} as Record<number, boolean>
    )
  );

  const handleToggleScrap = (id: number) => {
    setScrapStates(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const detailsList = listRef.current?.querySelectorAll<HTMLDetailsElement>("details");

    const handleToggle = (e: Event) => {
      const current = e.target as HTMLDetailsElement;
      if (current.open) {
        detailsList?.forEach((detail) => {
          if (detail !== current) detail.open = false;
        });
      }
    };

    detailsList?.forEach((detail) => detail.addEventListener("toggle", handleToggle));
    return () => {
      detailsList?.forEach((detail) => detail.removeEventListener("toggle", handleToggle));
    };
  }, []);

  return (
    <ul ref={listRef} className="flex-1 divide-y divide-gray-10 overflow-auto">
      {inquiries.map((inq) => (
        <InquiryItem
          key={inq.inquiry_id}
          group_name={group_name}
          division_name={division_name}
          team_name={team_name}
          inquiry={inq}
          isScraped={!!scrapStates[inq.inquiry_id]}
          onToggleScrap={handleToggleScrap}
        />
      ))}
    </ul>
  );
};

export default InquiryList;