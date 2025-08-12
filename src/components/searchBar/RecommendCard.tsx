import RightArrow from "@/assets/svgs/common/right.svg";
import { RecommendCardProps } from "@/types/search/search";

const RecommendCard = ({
  title,
  group_name,
  division_name,
  team_name,
  query,
  isSelected,
  onClick,
}: RecommendCardProps) => {
  // 제목에서 검색어와 일치하는 부분을 하이라이트
  const highlightTitle = (title: string, query: string) => {
    if (!query.trim()) return title;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = title.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <span key={index} className="text-main">
            {part}
          </span> // 일치하는 부분 색 변경
        );
      }
      return part;
    });
  };

  return (
    <div
      className="h-[94px] w-full bg-white rounded-[15px] hover:bg-gray-10 cursor-pointer p-6 flex items-center justify-between transition-colors"
      onClick={onClick}
    >
      <div className="flex flex-col justify-between h-full gap-2">
        <span
          className={`text-gray-80 ${isSelected ? "text-body1-b" : "text-body1"}`}
        >
          {highlightTitle(title, query)}
        </span>
        <span
          className={`text-gray-60 ${isSelected ? "text-detail1-b" : "text-detail2"}`}
        >
          {group_name} {">"} {division_name} {">"} {team_name}
        </span>
      </div>
      <RightArrow className="w-6 h-6 text-gray-30" />
    </div>
  );
};

export default RecommendCard;
