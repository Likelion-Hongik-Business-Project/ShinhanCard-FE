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
  groupId: number;
  groupName: string;
  active: boolean;
};

export interface Division {
  divisionId: number;
  divisionName: string;
  active: boolean;
}

export interface Team {
  teamId: number;
  teamName: string;
  active: boolean;
}
