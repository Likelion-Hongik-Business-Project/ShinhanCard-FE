import { useLayoutEffect, useRef, useState } from "react";

import { Arrow, DoubleArrow, FilledStar, Star } from "@/assets/svgs/board";
import { Inquiry } from "@/types/teamBoard";

interface InquiryItemProps {
  group_name: string;
  division_name: string;
  team_name: string;
  inquiry: Inquiry;
  isOpen: boolean;
  onToggleOpen: (id: number) => void;
  isScraped: boolean;
  onToggleScrap: (id: number) => void;
}

const MAX_PREVIEW_LENGTH = 500;

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const InquiryItem = ({
  group_name,
  division_name,
  team_name,
  inquiry,
  isOpen,
  onToggleOpen,
  isScraped,
  onToggleScrap,
}: InquiryItemProps) => {
  const preview = truncateText(inquiry.content_preview, MAX_PREVIEW_LENGTH);

  // 아코디언 애니매이션을 위해 높이 측정
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  // 실제 scrollHeight 읽어서 height 설정
  useLayoutEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [isOpen]);

  return (
    <li className="flex flex-col">
      <div
        className="flex items-center h-20 w-full px-10 cursor-pointer"
        onClick={() => onToggleOpen(inquiry.inquiry_id)}
      >
        <button
          type="button"
          onClick={e => {
            e.stopPropagation(); // 스크랩시 토글 방지
            onToggleScrap(inquiry.inquiry_id);
          }}
          className="mr-10 cursor-pointer"
        >
          {isScraped ? (
            <FilledStar className="w-5 h-5 fill-current text-main" />
          ) : (
            <Star className="w-5 h-5 text-gray-30" />
          )}
        </button>
        <div className="flex flex-col gap-2">
          <span
            className={
              (isOpen ? `text-body2-b ` : `text-body2 `) + `text-gray-80`
            }
          >
            {inquiry.title}
          </span>
          <span className="text-detail1 text-gray-60">
            {group_name} {">"} {division_name} {">"} {team_name}
          </span>
        </div>
        <Arrow
          className={
            "w-[14px] h-[8px] ml-auto " +
            (isOpen ? "rotate-180 text-main" : "rotate-0 text-gray-30")
          }
        />
      </div>
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? height : "0px" }}
        className="overflow-hidden transition-[max-height] duration-400 ease-in-out"
      >
        <div className="px-10 py-6 w-full border-t border-gray-10">
          <div className="px-9 py-8 bg-gray-10 rounded-[15px] text-gray-80 text-body2 flex flex-col gap-6">
            <p>{preview}</p>
            <button className="mx-auto text-body2-b px-6 py-2 cursor-pointer text-gray-60 flex gap-4 items-center">
              자세히
              <DoubleArrow className="w-[14px] h-[12px] text-gray-40" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default InquiryItem;
