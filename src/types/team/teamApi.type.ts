import { Division, Group, Member, Team } from "./user";

export type GetGroupResponse = Group;

export type GetDivisionResponse = Division;

export type GetTeamResponse = Team;

export interface GetMemberResponse {
  members: Member[];
  total_count: number;
}
