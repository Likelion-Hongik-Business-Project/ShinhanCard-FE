import { useState } from "react";

import { ORG_USERS } from "@/mocks/organizationMock";

export const useOrganizationSelector = () => {
  const [group, setGroup] = useState("");
  const [division, setDivision] = useState("");
  const [teamObj, setTeamObj] = useState<{
    team_name: string;
    users: { id: number; user_name: string }[];
  } | null>(null);

  const groupOptions = ORG_USERS.map(item => item.group_name);
  const selectedGroup = ORG_USERS.find(item => item.group_name === group);
  const divisionOptions = selectedGroup
    ? selectedGroup.divisions.map(d => d.division_name)
    : [];

  const selectedDivision = selectedGroup?.divisions.find(
    d => d.division_name === division
  );

  const teamOptions = selectedDivision
    ? selectedDivision.teams.map(t => t.team_name)
    : [];

  const handleGroupChange = (value: string) => {
    setGroup(value);
    setDivision("");
    setTeamObj(null);
  };

  const handleDivisionChange = (value: string) => {
    setDivision(value);
    setTeamObj(null);
  };

  const handleTeamChange = (teamName: string) => {
    const team = selectedDivision?.teams.find(t => t.team_name === teamName);
    if (team) {
      setTeamObj(team);
    }
  };

  return {
    group,
    division,
    team: teamObj?.team_name || "",
    groupOptions,
    divisionOptions,
    teamOptions,
    selectedTeam: teamObj,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
  };
};
