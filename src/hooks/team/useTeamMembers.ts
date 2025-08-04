import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { TeamMember } from "@/types/team/team.type";
import { MOCK_TEAM_MEMBERS } from "@/mocks/team/teamData";

import { getMembersByTeamId } from "@/apis/team/teamApi";

export const useTeamMembers = (teamId?: number) => {
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["teamMembers", teamId],
    queryFn: async () => {
      if (!teamId) return { result: { total_count: 0, members: [] } };

      try {
        const response = await getMembersByTeamId(teamId);
        return response;
      } catch (error) {
        // API 에러 시 Mock 데이터 사용
        console.log("API 에러, Mock 데이터 사용:", error);
        return {
          is_success: true,
          code: "COMMON200",
          message: "요청 처리 성공",
          result: {
            total_count: MOCK_TEAM_MEMBERS.length,
            members: MOCK_TEAM_MEMBERS,
          },
        };
      }
    },
    enabled: !!teamId,
  });

  // 검색어에 따른 필터링
  useEffect(() => {
    if (data?.result?.members) {
      const filtered = data.result.members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [data, searchTerm]);

  return {
    members: filteredMembers,
    totalCount: data?.result?.total_count || 0,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
  };
};
