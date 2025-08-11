import { useQuery } from "@tanstack/react-query";

import { getMyProfile } from "@/apis/profile/profileApi";
import { useAuthStore } from "@/store/useAuthStore";

export const useMyProfile = () => {
  const isLogin = useAuthStore(state => state.isLogin);

  return useQuery({
    queryKey: ["myProfile"], // 쿼리 키
    queryFn: getMyProfile, // API 호출 함수
    enabled: isLogin, // 로그인이 되어 있을 때만 이 쿼리를 실행
    staleTime: 1000 * 60 * 60, // 1시간 동안 데이터를 '신선함'으로 간주 (불필요한 API 호출 방지)
  });
};
