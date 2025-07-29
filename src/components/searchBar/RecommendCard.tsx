import RightArrow from "@/assets/svgs/common/right.svg";

interface RecommendCardProps {
  title: string;
  group_name: string;
  division_name: string;
  team_name: string;
  query: string;
  isSelected: boolean; // 부모로부터 선택 여부를 받음
  onClick: () => void; // 부모로부터 클릭 핸들러를 받음
}

const RecommendCard = ({
  title,
  group_name,
  division_name,
  team_name,
  query,
  isSelected, // props로 받은 isSelected 사용
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
      className="h-[94px] w-full bg-white hover:bg-gray-10 cursor-pointer p-6 flex items-center justify-between transition-colors"
      onClick={onClick} // 부모가 전달한 onClick을 그대로 사용
    >
      <div className="flex flex-col justify-between h-full">
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
