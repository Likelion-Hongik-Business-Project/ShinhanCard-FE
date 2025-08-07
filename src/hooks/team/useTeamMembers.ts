import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Member } from "@/types/team/user.type";

import { getMembersByTeamId } from "@/apis/team/teamApi";

export const useTeamMembers = (teamId?: number) => {
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["teamMembers", teamId],
    queryFn: async () => {
      if (!teamId) return { result: { total_count: 0, members: [] } };

      const response = await getMembersByTeamId(teamId);
      return response;
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
