import { ProfileData } from "@/types/profile/profile.type";

export const MOCK_PROFILE_DATA: ProfileData = {
  id: 1,
  name: "장윤영",
  group_name: "IT그룹",
  division_name: "IT본부",
  team_name: "Core 개발 2부",
  team_id: 2,
  email: "jangyoon@shinhancard.com",
  phone_number: "010-1000-1005",
  profile_image_url: "/assets/images/profile.png",
};

// 타인의 프로필 모킹 데이터
export const MOCK_OTHER_PROFILE_DATA: ProfileData = {
  id: 2,
  name: "김홍엽",
  group_name: "경영기획 그룹",
  division_name: "ICT 본부",
  team_name: "Core 개발 2부",
  team_id: 2,
  email: "abcdefghkj@naver.com",
  phone_number: "010-1111-2222",
  profile_image_url: "/assets/images/profile.png",
};
