import { useRef } from "react";

import { useTeamApi } from "@/hooks/team/useTeamApi";
import { Group } from "@/types/team/user.type";

type Props = {
  onGroupSelect: (group: Group) => void;
  selectedGroupId: number | null;
};

const GroupSelector = ({ onGroupSelect, selectedGroupId }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { useGroupsQuery } = useTeamApi();
  const { data: groupData, isLoading } = useGroupsQuery();

  const groups = groupData?.result ?? [];

  const handleClick = (group: Group) => {
    onGroupSelect(group);
  };

  return (
    <div
      ref={ref}
      className="w-[240px] h-[calc(100vh-64px)] bg-white px-8 py-[52px] border-x border-gray-20"
    >
      {isLoading ? null : (
        <ul className="flex flex-col gap-10">
          {groups.map(group => (
            <li
              key={group.group_id}
              onClick={() => handleClick(group)}
              className={`
                cursor-pointer text-heading2-b p-2 hover:bg-gray-10 rounded-lg
                ${
                  selectedGroupId === null
                    ? "text-gray-80"
                    : selectedGroupId === group.group_id
                      ? "text-main"
                      : "text-gray-30"
                }
              `}
            >
              {group.group_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupSelector;
