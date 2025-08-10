import {
  AssigneeUser,
  Division,
  Group,
  Member,
  MemberSummary,
  Team,
} from "./user.type";

export type GetGroupResponse = Group;

export type GetDivisionResponse = Division;

export type GetTeamResponse = Team;

export interface GetMemberSummaryResponse {
  teamId: number;
  teamMembers: MemberSummary[];
}

export interface GetMemberResponse {
  members: Member[];
  total_count: number;
}

export type GetUsersResponse = AssigneeUser;
