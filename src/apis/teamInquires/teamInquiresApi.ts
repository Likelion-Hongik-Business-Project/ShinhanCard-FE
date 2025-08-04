import { ApiResponse } from "@/types/apiResponse.type";
import {
  GetTeamInquiresRequest,
  GetTeamInquiresResponse,
} from "@/types/teamInquires/teamInquiresApi.type";

import instance from "@/apis/instance";

export const getTeamInquires = async (params: GetTeamInquiresRequest) => {
  try {
    const { team_id, page, status, date } = params;

    const response = await instance.get<ApiResponse<GetTeamInquiresResponse>>(
      `/api/teams/${team_id}/inquiries`,
      { params: status === "전체" ? { page, date } : { page, status, date } }
    );
    return response.data;
  } catch (error) {
    console.error("팀 문의글 리스트 조회 실패:", error);
    throw error;
  }
};
