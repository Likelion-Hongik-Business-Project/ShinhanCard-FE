import { useEffect, useState } from "react";

import { useOrganizationSelector } from "@/hooks/team/useOrganizationSelector";
import { useTeamApi } from "@/hooks/team/useTeamApi";
import { AssigneeUser } from "@/types/team/user.type";

import SelectDropdown from "./SelectDropdown";

interface Props {
  onSelectUser: (user: AssigneeUser) => void;
}

const DepartmentSelector = ({ onSelectUser }: Props) => {
  const {
    group,
    division,
    team,
    groupId,
    divisionId,
    teamId,
    groupOptions,
    divisionOptions,
    teamOptions,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
  } = useOrganizationSelector();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // teamId 기준으로 팀원 쿼리 호출
  const { useMembersByTeamIdQuery } = useTeamApi();
  const { data: memberData } = useMembersByTeamIdQuery(teamId);
  const users = memberData?.result?.members ?? [];

  // 소속 변경 시 사용자 초기화
  useEffect(() => {
    setSelectedUserId(null);
  }, [teamId]);

  const handleUserChange = (userId: number) => {
    setSelectedUserId(userId);
    const user = users.find(u => u.id === userId);

    if (user) {
      onSelectUser({
        id: user.id,
        name: user.name,
        group_name: group,
        division_name: division,
        team_name: team,
        profile_image_url: user.profile_image_url,
      });
    }
  };

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
          options={users.map(user => ({
            label: user.name,
            value: user.id,
            profileImageUrl: user.profile_image_url,
          }))}
          value={selectedUserId ?? 0}
          onChange={handleUserChange}
          placeholder="이름"
          type="user"
          disabled={!teamId || users.length === 0}
        />
      </div>
    </div>
  );
};

export default DepartmentSelector;
