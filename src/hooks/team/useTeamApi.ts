import { useQuery } from "@tanstack/react-query";

import { AssigneeUser } from "@/types/team/user.type";

import {
  getDivisionsByGroupId,
  getGroups,
  getMembersByTeamId,
  getTeamsByDivisionId,
  getUsers,
} from "@/apis/team/teamApi";

export const useTeamApi = () => {
  const useUsersQuery = () =>
    useQuery<AssigneeUser[]>({
      queryKey: ["users"],
      queryFn: async () => {
        const { result } = await getUsers();
        return result.map(user => ({
          id: user.user_id,
          name: user.username,
          profile_image_url: user.profile_url,
          group_name: user.group.groupName,
          division_name: user.division.divisionName,
          team_name: user.team.teamName,
        }));
      },
    });

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
    useUsersQuery,
    useGroupsQuery,
    useDivisionsByGroupIdQuery,
    useTeamsByDivisionIdQuery,
    useMembersByTeamIdQuery,
  };
};
