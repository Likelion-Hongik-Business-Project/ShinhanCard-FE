import { ApiResponse } from "@/types/apiResponse.type";
import { GetTeamInquiresResponse } from "@/types/teamInquires/teamInquiresApi.type";

import instance from "@/apis/instance";

export const getTeamInquires = async (
  team_id: number,
  page = 1,
  status?: string,
  date?: string
): Promise<ApiResponse<GetTeamInquiresResponse>> => {
  const response = await instance.get(`/api/teams/${team_id}/inquiries`, {
    params: { page, status, date },
  });
  return response.data;
};
