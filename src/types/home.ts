export interface InterestMember {
  name: string;
  member_id: string;
  group_name: string;
  division_name: string;
  team_name: string;
  profile_image_url: string;
}

export interface HomeData {
  id: number;
  name: string;
  profile_image_url: string;
  answer_count: number;
  inquiry_count: number;
  interest_count: number;
}

export interface HomeButtonProps {
  type: string;
  count: number;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
  onClick: (type: string) => void;
}
