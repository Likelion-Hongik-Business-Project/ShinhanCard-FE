import { useState } from "react";

import { useTeamApi } from "@/hooks/team/useTeamApi";

export const useOrganizationSelector = () => {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);

  const {
    useGroupsQuery,
    useDivisionsByGroupIdQuery,
    useTeamsByDivisionIdQuery,
  } = useTeamApi();

  const { data: groupData } = useGroupsQuery();
  const { data: divisionData } = useDivisionsByGroupIdQuery(groupId);
  const { data: teamData } = useTeamsByDivisionIdQuery(divisionId);

  const groupOptions =
    groupData?.result.map(group => ({
      label: group.group_name,
      value: Number(group.group_id),
    })) ?? [];

  const divisionOptions =
    divisionData?.result.map(division => ({
      label: division.division_name,
      value: division.division_id,
    })) ?? [];

  const teamOptions =
    teamData?.result.map(team => ({
      label: team.team_name,
      value: team.team_id,
    })) ?? [];

  const handleGroupChange = (value: number) => {
    setGroupId(value);
    setDivisionId(null);
    setTeamId(null);
  };

  const handleDivisionChange = (value: number) => {
    setDivisionId(value);
    setTeamId(null);
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
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
  };
};
