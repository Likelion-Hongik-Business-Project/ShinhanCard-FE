import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { MOCK_DIVISIONS, MOCK_GROUPS, MOCK_TEAMS } from "@/mocks/team/teamData";

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
    queryFn: async () => {
      try {
        const response = await getGroups();
        return response;
      } catch (error) {
        console.log("그룹 API 에러, Mock 데이터 사용:", error);
        return {
          is_success: true,
          code: "COMMON200",
          message: "요청 처리 성공",
          result: MOCK_GROUPS,
        };
      }
    },
  });

  // 본부 목록 조회
  const { data: divisionsData, isLoading: divisionsLoading } = useQuery({
    queryKey: ["divisions", selectedGroupId],
    queryFn: async () => {
      if (!selectedGroupId) return { result: [] };

      try {
        const response = await getDivisionsByGroupId(selectedGroupId);
        return response;
      } catch (error) {
        console.log("본부 API 에러, Mock 데이터 사용:", error);
        return {
          is_success: true,
          code: "COMMON200",
          message: "요청 처리 성공",
          result: MOCK_DIVISIONS,
        };
      }
    },
    enabled: !!selectedGroupId,
  });

  // 팀 목록 조회
  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ["teams", selectedDivisionId],
    queryFn: async () => {
      if (!selectedDivisionId) return { result: [] };

      try {
        const response = await getTeamsByDivisionId(selectedDivisionId);
        return response;
      } catch (error) {
        console.log("팀 API 에러, Mock 데이터 사용:", error);
        return {
          is_success: true,
          code: "COMMON200",
          message: "요청 처리 성공",
          result: MOCK_TEAMS,
        };
      }
    },
    enabled: !!selectedDivisionId,
  });

  const groups = groupsData?.result || [];
  const divisions = divisionsData?.result || [];
  const teams = teamsData?.result || [];

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
    selectedGroup: groups.find(g => g.groupId === selectedGroupId),
    selectedDivision: divisions.find(d => d.divisionId === selectedDivisionId),
    selectedTeam: teams.find(t => t.teamId === selectedTeamId),
  };
};
