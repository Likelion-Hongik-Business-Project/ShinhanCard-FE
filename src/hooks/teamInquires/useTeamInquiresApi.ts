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
    queryKey: ["teamInquires", team_id, page, status, date],
    queryFn: async () => {
      const response = await getTeamInquires({
        team_id: team_id,
        page,
        status,
        date,
      });
      return response.result;
    },
    enabled: !!team_id,
  });
};
