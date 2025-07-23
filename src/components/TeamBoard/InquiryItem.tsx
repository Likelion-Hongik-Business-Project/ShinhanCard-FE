// src/components/TeamBoard/InquiryItem.tsx
import { Arrow, DoubleArrow, Star } from "@/assets/svgs/board";
import { Inquiry } from "@/types/teamBoard";

interface InquiryItemProps {
  idx: number;
  inquiry: Inquiry;
  isOpen: boolean;
  onToggleItem: (idx: number) => void;
}

const InquiryItem = ({
  idx,
  inquiry,
  isOpen,
  onToggleItem,
}: InquiryItemProps) => {
  return (
    <li className="border-b border-gray-10 flex flex-col items-center pr-10 pl-4">
      <button
        type="button"
        onClick={() => onToggleItem(idx)}
        className="flex items-center h-20 w-full py-6 focus:outline-none"
      >
        <Star className="w-5 h-5 text-gray-30 mr-10" />
        <span className="text-body1 text-gray-80">{inquiry.title}</span>
        <Arrow
          className={
            "w-[14px] h-[8px] ml-auto transform transition-transform " +
            (isOpen ? "rotate-180 text-gray-100" : "rotate-0 text-gray-30")
          }
        />
      </button>
      {isOpen && (
        <div className="pl-9 pb-6 w-full">
          <div className="px-9 py-8 bg-gray-10 rounded-2xl text-gray-80 text-body2 flex flex-col gap-6">
            <p>{inquiry.content_preview}</p>
            <button className="mx-auto text-body2 text-gray-60 p-2 flex gap-4 items-center">
              자세히
              <DoubleArrow className="w-14px h-12px text-gray-40" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default InquiryItem;
