import { useOrganizationSelector } from "@/hooks/useOrganizationSelector";
import { User } from "@/types/user";

import SelectDropdown from "./SelectDropdown";

interface DepartmentSelectorProps {
  onSelectUser: (user: User) => void;
}

const DepartmentSelector = ({ onSelectUser }: DepartmentSelectorProps) => {
  const {
    group,
    division,
    team,
    groupOptions,
    divisionOptions,
    teamOptions,
    selectedTeam,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
  } = useOrganizationSelector();

  return (
    <div className="flex flex-col h-[378px] pt-3 pb-8 px-2.5">
      <span className="text-detail1 text-gray-50 mb-2.5">
        사용자의 소속을 선택하세요
      </span>

      <div className="flex gap-2">
        <SelectDropdown
          options={groupOptions}
          value={group}
          onChange={handleGroupChange}
          placeholder="그룹 선택"
          type="group"
        />
        <SelectDropdown
          options={divisionOptions}
          value={division}
          onChange={handleDivisionChange}
          placeholder="소속본부 선택"
          type="division"
          disabled={!group}
        />
        <SelectDropdown
          options={teamOptions}
          value={team}
          onChange={handleTeamChange}
          placeholder="팀 선택"
          type="team"
          disabled={!division}
        />
        <SelectDropdown
          options={selectedTeam?.users.map(u => u.user_name) || []}
          value={""}
          onChange={name => {
            const user = selectedTeam?.users.find(u => u.user_name === name);
            if (user) {
              onSelectUser({
                id: user.id,
                user_name: user.user_name,
                group_name: group,
                division_name: division,
                team_name: team,
              });
            }
          }}
          placeholder="이름"
          type="user"
          disabled={!team}
        />
      </div>
    </div>
  );
};

export default DepartmentSelector;
