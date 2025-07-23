import { useRef, useState } from "react";

import { groupTeamData } from "@/mocks/groupTeamData";

type Props = {
  onClose: () => void;
  onGroupSelect: (group: string) => void;
};

const GroupSelector = ({ onGroupSelect }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const groupList = Object.keys(groupTeamData);

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const handleClick = (group: string) => {
    setSelectedGroup(group);
    onGroupSelect(group);
  };

  return (
    <div
      ref={ref}
      className="w-[240px] h-full bg-white px-8 py-[52px] border border-gray-20"
    >
      <ul className="flex flex-col gap-10">
        {groupList.map(group => {
          const isSelected = selectedGroup === group;
          const hasSelection = selectedGroup !== null;

          return (
            <li
              key={group}
              onClick={() => handleClick(group)}
              className={`
                cursor-pointer text-heading2-b p-2 hover:bg-gray-10 rounded-lg
                ${
                  hasSelection
                    ? isSelected
                      ? "text-main"
                      : "text-gray-30"
                    : "text-gray-80"
                }
              `}
            >
              {group}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GroupSelector;
