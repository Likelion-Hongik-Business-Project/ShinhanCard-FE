import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Division, Group, Team } from "@/types/team/user.type";

import {
  getDivisionsByGroupId,
  getGroups,
  getTeamsByDivisionId,
} from "@/apis/team/teamApi";

export const useTeamSelection = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(
    null
  );
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  // 그룹 목록 조회
  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  // 본부 목록 조회
  const { data: divisionsData, isLoading: divisionsLoading } = useQuery({
    queryKey: ["divisions", selectedGroupId],
    queryFn: async () => {
      if (!selectedGroupId) return { result: [] };

      const response = await getDivisionsByGroupId(selectedGroupId);
      return response;
    },
    enabled: !!selectedGroupId,
  });

  // 팀 목록 조회
  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ["teams", selectedDivisionId],
    queryFn: async () => {
      if (!selectedDivisionId) return { result: [] };

      const response = await getTeamsByDivisionId(selectedDivisionId);
      return response;
    },
    enabled: !!selectedDivisionId,
  });

  // API 데이터 사용
  const groups: Group[] = groupsData?.result || [];
  const divisions: Division[] = divisionsData?.result || [];
  const teams: Team[] = teamsData?.result || [];

  const isLoading = groupsLoading || divisionsLoading || teamsLoading;

  return {
    // 데이터
    groups,
    divisions,
    teams,
    isLoading,

    // 선택된 ID들
    selectedGroupId,
    selectedDivisionId,
    selectedTeamId,

    // 선택 함수들
    setSelectedGroupId: (groupId: number) => {
      setSelectedGroupId(groupId);
      setSelectedDivisionId(null);
      setSelectedTeamId(null);
    },
    setSelectedDivisionId: (divisionId: number) => {
      setSelectedDivisionId(divisionId);
      setSelectedTeamId(null);
    },
    setSelectedTeamId: (teamId: number) => {
      setSelectedTeamId(teamId);
    },
    // 초기화 함수
    resetSelection: () => {
      setSelectedGroupId(null);
      setSelectedDivisionId(null);
      setSelectedTeamId(null);
    },

    // 선택된 항목들
    selectedGroup: groups.find((g: Group) => g.groupId === selectedGroupId),
    selectedDivision: divisions.find(
      (d: Division) => d.divisionId === selectedDivisionId
    ),
    selectedTeam: teams.find((t: Team) => t.teamId === selectedTeamId),
  };
};
