import { useEffect, useState } from "react";

import { useTeamApi } from "@/hooks/team/useTeamApi";
import { Member } from "@/types/team/user.type";

export const useOrganizationSelector = () => {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [users, setUsers] = useState<Member[]>([]);

  const {
    useGroupsQuery,
    useDivisionsByGroupIdQuery,
    useTeamsByDivisionIdQuery,
    useMembersByTeamIdQuery,
  } = useTeamApi();

  const { data: groupData } = useGroupsQuery();
  const { data: divisionData } = useDivisionsByGroupIdQuery(groupId);
  const { data: teamData } = useTeamsByDivisionIdQuery(divisionId);
  const { data: memberData } = useMembersByTeamIdQuery(teamId);

  useEffect(() => {
    if (memberData?.result?.members) {
      setUsers(memberData.result.members);
    }
  }, [memberData]);

  const groupOptions =
    groupData?.result.map(group => ({
      label: group.groupName,
      value: Number(group.groupId),
    })) ?? [];

  const divisionOptions =
    divisionData?.result.map(division => ({
      label: division.divisionName,
      value: division.divisionId,
    })) ?? [];

  const teamOptions =
    teamData?.result.map(team => ({
      label: team.teamName,
      value: team.teamId,
    })) ?? [];

  const handleGroupChange = (value: number) => {
    setGroupId(value);
    setDivisionId(null);
    setTeamId(null);
    setUsers([]);
  };

  const handleDivisionChange = (value: number) => {
    setDivisionId(value);
    setTeamId(null);
    setUsers([]);
  };

  const handleTeamChange = (value: number) => {
    setTeamId(value);
  };

  const group = groupOptions.find(g => g.value === groupId)?.label || "";
  const division =
    divisionOptions.find(d => d.value === divisionId)?.label || "";
  const team = teamOptions.find(t => t.value === teamId)?.label || "";

  return {
    group,
    division,
    team,
    groupId,
    divisionId,
    teamId,
    groupOptions,
    divisionOptions,
    teamOptions,
    users,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
  };
};
