import { useState } from "react";

import { User } from "@/types/user";

import SelectDropdown from "./SelectDropdown";

import { ORG_USERS } from "@/mocks/organizationMock";
interface DepartmentSelectorProps {
  onSelectUser: (user: User) => void;
}

const DepartmentSelector = ({ onSelectUser }: DepartmentSelectorProps) => {
  const [group, setGroup] = useState("");
  const [division, setDivision] = useState("");
  const [team, setTeam] = useState("");
  const [userName, setUserName] = useState("");

  const selectedGroup = ORG_USERS.find(g => g.group_name === group);
  const divisionOptions =
    selectedGroup?.divisions.map(d => d.division_name) || [];

  const selectedDivision = selectedGroup?.divisions.find(
    d => d.division_name === division
  );
  const teamOptions = selectedDivision?.teams.map(t => t.team_name) || [];

  const selectedTeam = selectedDivision?.teams.find(t => t.team_name === team);
  const userOptions = selectedTeam?.users.map(u => u.user_name) || [];

  return (
    <div className="flex flex-col h-[378px] pt-3 pb-8 px-2.5">
      <span className="text-detail1 text-gray-50 mb-2.5">
        사용자의 소속을 선택하세요
      </span>

      <div className="flex gap-2">
        <SelectDropdown
          options={ORG_USERS.map(g => g.group_name)}
          value={group}
          onChange={value => {
            setGroup(value);
            setDivision("");
            setTeam("");
            setUserName("");
          }}
          placeholder="그룹 선택"
          type="group"
        />
        <SelectDropdown
          options={divisionOptions}
          value={division}
          onChange={value => {
            setDivision(value);
            setTeam("");
            setUserName("");
          }}
          placeholder="소속본부 선택"
          type="division"
          disabled={!group}
        />
        <SelectDropdown
          options={teamOptions}
          value={team}
          onChange={value => {
            setTeam(value);
            setUserName("");
          }}
          placeholder="팀 선택"
          type="team"
          disabled={!division}
        />
        <SelectDropdown
          options={userOptions}
          value={userName}
          onChange={name => {
            setUserName(name);
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
