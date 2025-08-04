import { useQuery } from "@tanstack/react-query";

import {
  getDivisionsByGroupId,
  getGroups,
  getMembersByTeamId,
  getTeamsByDivisionId,
} from "@/apis/team/teamApi";

export const useTeamApi = () => {
  const useGroupsQuery = () =>
    useQuery({
      queryKey: ["groups"],
      queryFn: getGroups,
    });

  const useDivisionsByGroupIdQuery = (groupId: number | null) =>
    useQuery({
      queryKey: ["divisions", groupId],
      queryFn: () => getDivisionsByGroupId(groupId!),
      enabled: !!groupId,
    });

  const useTeamsByDivisionIdQuery = (divisionId: number | null) =>
    useQuery({
      queryKey: ["teams", divisionId],
      queryFn: () => getTeamsByDivisionId(divisionId!),
      enabled: !!divisionId,
    });

  const useMembersByTeamIdQuery = (teamId: number | null) =>
    useQuery({
      queryKey: ["members", teamId],
      queryFn: () => getMembersByTeamId(teamId!),
      enabled: !!teamId,
    });

  return {
    useGroupsQuery,
    useDivisionsByGroupIdQuery,
    useTeamsByDivisionIdQuery,
    useMembersByTeamIdQuery,
  };
};
