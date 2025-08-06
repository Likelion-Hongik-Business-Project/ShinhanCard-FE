import { ApiResponse } from "@/types/apiResponse.type";
import {
  GetDivisionResponse,
  GetGroupResponse,
  GetMemberResponse,
  GetTeamResponse,
  GetUsersResponse,
} from "@/types/team/teamApi.type";

import instance from "@/apis/instance";

export const getUsers = async (): ApiResponse<GetUsersResponse[]> => {
  const response = await instance.get("/api/users");
  return response.data;
};

export const getGroups = async (): ApiResponse<GetGroupResponse[]> => {
  const response = await instance.get("/api/groups");
  return response.data;
};

export const getDivisionsByGroupId = async (
  groupId: number
): ApiResponse<GetDivisionResponse[]> => {
  const response = await instance.get(`/api/groups/${groupId}/divisions`);
  return response.data;
};

export const getTeamsByDivisionId = async (
  divisionId: number
): ApiResponse<GetTeamResponse[]> => {
  const response = await instance.get(`/api/divisions/${divisionId}/teams`);
  return response.data;
};

export const getMembersByTeamId = async (
  teamId: number
): ApiResponse<GetMemberResponse> => {
  const response = await instance.get(`/api/teams/${teamId}/members/details`);
  return response.data;
};
