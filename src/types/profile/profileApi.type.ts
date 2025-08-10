export interface GetProfileResponse {
  id: number;
  name: string;
  group_name: string;
  division_name: string;
  team_name: string;
  team_id: number;
  email: string;
  phone_number: string;
  profile_image_url: string | null;
}
