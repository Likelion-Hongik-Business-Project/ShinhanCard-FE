import { Arrow, DoubleArrow, FilledStar, Star } from "@/assets/svgs/board";
import { Inquiry } from "@/types/teamBoard";

interface InquiryItemProps {
  group_name: string;
  division_name: string;
  team_name: string;
  inquiry: Inquiry;
  isScraped: boolean;
  onToggleScrap: (id: number) => void;
}

const InquiryItem = ({ group_name, division_name, team_name, inquiry, isScraped, onToggleScrap }: InquiryItemProps) => {
  return (
    <li className="flex flex-col">
      <details className="group flex flex-col">
        <summary className="flex items-center h-20 w-full px-10 cursor-pointer">
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
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
            <span className="text-body2 group-open:text-body2-b text-gray-80">{inquiry.title}</span>
            <span className="text-detail1 text-gray-60">{group_name} {'>'} {division_name} {'>'} {team_name}</span>
          </div>
          <Arrow
            className="w-[14px] h-[8px] ml-auto group-open:rotate-180 group-open:text-main text-gray-30"
          />
        </summary>
        <div className="px-10 py-6 w-full border-t border-gray-10">
          <div className="px-9 py-8 bg-gray-10 rounded-[15px] text-gray-80 text-body2 flex flex-col gap-6">
            <p>{inquiry.content_preview}</p>
            <button className="mx-auto text-body2-b px-6 py-2 cursor-pointer text-gray-60 flex gap-4 items-center">
              자세히
              <DoubleArrow className="w-[14px] h-[12px] text-gray-40" />
            </button>
          </div>
        </div>
      </details>
    </li>
  );
};

export default InquiryItem;