import { useEffect, useRef, useState } from "react";

import { TeamItem } from "@/types/inquiry/inquiryListApi.type";

type Props = {
  team: TeamItem;
  isSelected: boolean;
  onClick: () => void;
};

const TeamTabButton = ({ team, isSelected, onClick }: Props) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [team]);

  return (
    <button
      onClick={onClick}
      className={`relative group px-7 py-5 rounded-t-[15px] min-w-0 max-w-[440px] cursor-pointer transition mb-[1px] ${
        isSelected
          ? "border-t-[2px] text-gray-80 border-main bg-white pt-[18px]"
          : "bg-gray-20 text-gray-50"
      }`}
    >
      <span
        ref={textRef}
        className="text-heading3-b truncate block overflow-hidden whitespace-nowrap text-ellipsis"
      >
        {team.group_name} &gt; {team.division_name} &gt; {team.team_name}
      </span>

      {isTruncated && (
        <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition pointer-events-none">
          <div className="px-2 py-1 rounded-[8px] bg-main-dark text-white text-detail3 whitespace-nowrap">
            {team.group_name} &gt; {team.division_name} &gt; {team.team_name}
          </div>
        </div>
      )}
    </button>
  );
};

export default TeamTabButton;
