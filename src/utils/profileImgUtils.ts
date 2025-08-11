// 프로필 이미지 URL을 반환하는 유틸리티 함수
export const getProfileImageUrl = (profileImageUrl: string | null): string => {
  if (!profileImageUrl) {
    return "/src/assets/svgs/common/profile.svg";
  }
  return profileImageUrl;
};
