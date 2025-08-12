import profileFallbackUrl from "@/assets/svgs/common/profile.svg?url";

// 프로필 이미지 URL을 반환하는 유틸리티 함수
export const getProfileImageUrl = (profileImageUrl: string | null): string => {
  const trimmed = profileImageUrl?.trim();
  if (!trimmed) {
    return profileFallbackUrl;
  }
  return trimmed;
};
