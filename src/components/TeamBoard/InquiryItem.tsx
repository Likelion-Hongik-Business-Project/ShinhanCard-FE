import { useEffect, useLayoutEffect, useRef, useState } from "react";

import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import { DoubleArrow, FilledStar, Star } from "@/assets/svgs/board";
import Arrow from "@/assets/svgs/common/down.svg";
import { MAX_PREVIEW_LENGTH } from "@/constants/inquiry";
import { useScrap } from "@/hooks/scrap/useScrap";
import { truncateText } from "@/utils/truncateText";
import { Inquiry } from "@/types/teamInquires/teamInquiresApi.type";

interface InquiryItemProps {
  group_name: string;
  division_name: string;
  team_name: string;
  inquiry: Inquiry;
  isOpen: boolean;
  onToggleOpen: (id: number) => void;
  isScraped: boolean;
}

const InquiryItem = ({
  group_name,
  division_name,
  team_name,
  inquiry,
  isOpen,
  onToggleOpen,
  isScraped,
}: InquiryItemProps) => {
  const navigate = useNavigate();
  const { scrapInquiry, unscrapInquiry } = useScrap();
  const [scraped, setScraped] = useState(isScraped);

  const preview = truncateText(inquiry.contentPreview, MAX_PREVIEW_LENGTH);

  // 아코디언 애니매이션을 위해 높이 측정
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  // 실제 scrollHeight 읽어서 height 설정
  useLayoutEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [isOpen]);

  // props 변경 시 동기화
  useEffect(() => {
    setScraped(isScraped);
  }, [isScraped]);

  useLayoutEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [isOpen]);

  const handleScrapClick = async (id: number) => {
    const next = !scraped;
    setScraped(next); // 낙관적 업데이트

    try {
      if (next) {
        await scrapInquiry(id);
      } else {
        await unscrapInquiry(id);
      }
    } catch {
      setScraped(!next); // 실패 시 롤백
    }
  };

  const handleDetailClick = () => {
    navigate(`/inquiries/${inquiry.inquiry_id}`);
  };

  return (
    <li className="flex flex-col">
      <div
        className="flex items-center h-[98px] w-full px-10 cursor-pointer hover:bg-gray-10"
        onClick={() => onToggleOpen(inquiry.inquiry_id)}
      >
        <button
          type="button"
          onClick={e => {
            e.stopPropagation(); // 스크랩시 토글 방지
            handleScrapClick(inquiry.inquiry_id);
          }}
          className="mr-10 cursor-pointer"
        >
          {scraped ? (
            <FilledStar className="w-5 h-5 fill-current text-main" />
          ) : (
            <Star className="w-5 h-5 text-gray-30" />
          )}
        </button>
        <div className="flex flex-col gap-2">
          <span
            className={`${isOpen ? "text-body2-b" : "text-body2"} text-gray-80`}
          >
            {inquiry.title}
          </span>
          <span className="text-detail1 text-gray-60">
            {group_name} {">"} {division_name} {">"} {team_name}
          </span>
        </div>
        <Arrow
          className={clsx("w-6 h-6 ml-auto", {
            "rotate-180 text-main": isOpen,
            "rotate-0 text-gray-30": !isOpen,
          })}
        />
      </div>
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? height : "0px" }}
        className="overflow-hidden transition-[max-height] duration-400 ease-in-out"
      >
        <div className="px-10 py-6 w-full border-t border-gray-10">
          <div className="pl-9 pr-10 py-8 bg-gray-10 rounded-[15px] text-gray-80 text-body2 flex flex-col gap-6">
            <p>{preview}</p>
            <button
              onClick={handleDetailClick}
              className="mx-auto text-body2-b px-6 py-2 cursor-pointer text-gray-60 flex gap-4 items-center"
            >
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
