import { ApiResponse } from "@/types/common/api.type";
import {
  GetDivisionResponse,
  GetGroupResponse,
  GetMemberResponse,
  GetTeamResponse,
} from "@/types/team/team.type";

import instance from "@/apis/instance";

// 그룹 목록 조회
export const getGroups = async (): Promise<ApiResponse<GetGroupResponse[]>> => {
  const response =
    await instance.get<ApiResponse<GetGroupResponse[]>>("/groups");
  return response.data;
};

// 본부 목록 조회
export const getDivisionsByGroupId = async (
  groupId: number
): Promise<ApiResponse<GetDivisionResponse[]>> => {
  const response = await instance.get<ApiResponse<GetDivisionResponse[]>>(
    `/groups/${groupId}/divisions`
  );
  return response.data;
};

// 팀 목록 조회
export const getTeamsByDivisionId = async (
  divisionId: number
): Promise<ApiResponse<GetTeamResponse[]>> => {
  const response = await instance.get<ApiResponse<GetTeamResponse[]>>(
    `/divisions/${divisionId}/teams`
  );
  return response.data;
};

// 팀원 목록 조회
export const getMembersByTeamId = async (
  teamId: number
): Promise<ApiResponse<GetMemberResponse>> => {
  const response = await instance.get<ApiResponse<GetMemberResponse>>(
    `/api/teams/${teamId}/members/details`
  );
  return response.data;
};
