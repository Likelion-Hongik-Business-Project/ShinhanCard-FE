export interface ProfileData {
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

// 프로필 이미지 URL을 반환하는 유틸리티 함수
export const getProfileImageUrl = (profileImageUrl: string | null): string => {
  if (!profileImageUrl) {
    return "/src/assets/svgs/common/profile.svg";
  }
  return profileImageUrl;
};
