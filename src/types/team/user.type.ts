export interface AssigneeUser {
  user_id: number;
  username: string;
  profile_url: string;
  group: Group;
  division: Division;
  team: Team;
}

export interface Member {
  id: number;
  name: string;
  profile_image_url: string;
  email: string;
  phone: string;
  group_name: string;
  division_name: string;
  team_name: string;
}

export type Group = {
  group_id: number;
  group_name: string;
  active: boolean;
};

export interface Division {
  division_id: number;
  division_name: string;
  active: boolean;
}

export interface Team {
  team_id: number;
  team_name: string;
  active: boolean;
}

export interface MemberSummary {
  userId: number;
  userName: string;
  profileImageUrl: string;
}
