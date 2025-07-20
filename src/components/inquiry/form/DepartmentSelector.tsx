import { useState } from "react";

import { MOCK_USERS } from "@/constants/usersMock";

import SelectDropdown from "./SelectDropdown";

interface DepartmentSelectorProps {
  onSelectUser: (user: (typeof MOCK_USERS)[0]) => void;
}

const DepartmentSelector = ({ onSelectUser }: DepartmentSelectorProps) => {
  const [group, setGroup] = useState("");
  const [division, setDivision] = useState("");
  const [team, setTeam] = useState("");
  const [userName, setUserName] = useState("");

  return (
    <div className="flex flex-col h-[378px] pt-3 pb-8 px-2.5">
      <span className="text-detail1 text-gray-50 mb-2.5">
        사용자의 소속을 선택하세요
      </span>

      <div className="flex gap-2">
        <SelectDropdown
          options={["그룹 1", "그룹 2", "그룹 3"]}
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
          options={["소속본부 1", "소속본부 2"]}
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
          options={["팀 1", "팀 2"]}
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
          options={MOCK_USERS.map(u => u.name)}
          value={userName}
          onChange={name => {
            setUserName(name);
            const user = MOCK_USERS.find(u => u.name === name);
            if (user) onSelectUser(user);
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
