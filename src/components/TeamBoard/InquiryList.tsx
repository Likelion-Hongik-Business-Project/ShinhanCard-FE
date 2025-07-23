import InquiryItem from "@/components/TeamBoard/InquiryItem";
import { Inquiry } from "@/types/teamBoard";

interface InquiryListProps {
  inquiries: Inquiry[];
  isItemExpandedMap: Record<number, boolean>;
  onToggleItem: (idx: number) => void;
}

const InquiryList = ({
  inquiries,
  isItemExpandedMap,
  onToggleItem,
}: InquiryListProps) => {
  return (
    <ul>
      {inquiries.map((q, idx) => (
        <InquiryItem
          key={idx}
          idx={idx}
          inquiry={q}
          isOpen={!!isItemExpandedMap[idx]}
          onToggleItem={onToggleItem}
        />
      ))}
    </ul>
  );
};

export default InquiryList;
