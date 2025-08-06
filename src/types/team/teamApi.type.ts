import { Division, Group, Member, Team } from "./user.type";

export type GetGroupResponse = Group;

export type GetDivisionResponse = Division;

export type GetTeamResponse = Team;

export interface GetMemberResponse {
  members: Member[];
  total_count: number;
}

export interface GetUsersResponse {
  username: string;
  profile_url: string;
  group: Group;
  division: Division;
  team: Team;
}
