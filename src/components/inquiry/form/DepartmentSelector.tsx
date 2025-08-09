import { useDepartmentSelector } from "@/hooks/team/useDepartmentSelector";
import { AssigneeUser } from "@/types/team/user.type";

import SelectDropdown from "./SelectDropdown";

interface Props {
  allUsers: AssigneeUser[];
  onSelectUser: (user: AssigneeUser) => void;
}

const DepartmentSelector = ({ allUsers, onSelectUser }: Props) => {
  const {
    groupId,
    divisionId,
    teamId,
    selectedUserId,
    groupOptions,
    divisionOptions,
    teamOptions,
    userOptions,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
    handleUserChange,
  } = useDepartmentSelector(allUsers);

  return (
    <div className="flex flex-col h-[378px] pt-3 pb-8 px-2.5">
      <span className="text-detail1 text-gray-50 mb-2.5">
        사용자의 소속을 선택하세요
      </span>

      <div className="flex gap-2">
        <SelectDropdown
          options={groupOptions}
          value={groupId ?? 0}
          onChange={handleGroupChange}
          placeholder="그룹 선택"
          type="group"
        />
        <SelectDropdown
          options={divisionOptions}
          value={divisionId ?? 0}
          onChange={handleDivisionChange}
          placeholder="소속본부 선택"
          type="division"
          disabled={!groupId}
        />
        <SelectDropdown
          options={teamOptions}
          value={teamId ?? 0}
          onChange={handleTeamChange}
          placeholder="팀 선택"
          type="team"
          disabled={!divisionId}
        />
        <SelectDropdown
          options={userOptions}
          value={selectedUserId ?? 0}
          onChange={id => {
            const picked = handleUserChange(id);
            if (picked) onSelectUser(picked);
          }}
          placeholder="이름"
          type="user"
          disabled={!teamId || userOptions.length === 0}
        />
      </div>
    </div>
  );
};

export default DepartmentSelector;
