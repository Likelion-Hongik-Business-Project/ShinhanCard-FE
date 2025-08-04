// 그룹 관련 타입
export interface GetGroupResponse {
  groupId: number;
  groupName: string;
  active: boolean;
}

// 본부 관련 타입
export interface GetDivisionResponse {
  divisionId: number;
  divisionName: string;
  active: boolean;
}

// 팀 관련 타입
export interface GetTeamResponse {
  teamId: number;
  teamName: string;
  active: boolean;
}

// 팀원 관련 타입
export interface TeamMember {
  id: number;
  name: string;
  profile_image_url: string | null;
  email: string;
  phone: string;
  group_name: string;
  division_name: string;
  team_name: string;
}

export interface GetMemberResponse {
  total_count: number;
  members: TeamMember[];
}
