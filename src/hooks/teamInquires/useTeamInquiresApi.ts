import { useQuery } from "@tanstack/react-query";

import type {
  GetTeamInquiresRequest,
  GetTeamInquiresResponse,
} from "@/types/teamInquires/teamInquiresApi.type";

import { getTeamInquires } from "@/apis/teamInquires/teamInquiresApi";

export const useTeamInquires = ({
  team_id,
  page = 1,
  status,
  date,
}: GetTeamInquiresRequest) => {
  return useQuery<GetTeamInquiresResponse>({
    queryKey: ["inquiries", "team", team_id, page, status, date],
    queryFn: async () => {
      if (!team_id) throw new Error("team_id 가 필요합니다");
      const response = await getTeamInquires(team_id, page, status, date);
      return response.result;
    },
    enabled: !!team_id,
    staleTime: 1000 * 60,
  });
};
