export interface User {
  id: number;
  user_name: string;
  group_name: string;
  division_name: string;
  team_name: string;
}

export type Group = {
  group_id: number;
  name: string;
  is_active: boolean;
};

export interface Division {
  division_id: number;
  name: string;
  is_active: boolean;
}

export interface Team {
  team_id: number;
  name: string;
  is_active: boolean;
}
