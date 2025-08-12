import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyProfile } from "@/apis/profile/profileApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";

export const useProfile = () => {
  const { isLogin } = useAuthStore();
  const { profile, setProfile, setLoading, setError, clearProfile } =
    useProfileStore();
  const queryClient = useQueryClient();

  const { refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await getMyProfile();
        if (response.is_success) {
          setProfile(response.result);
          return response.result;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "프로필 조회에 실패했습니다.";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: false, // 수동으로 호출하도록 설정
  });

  useEffect(() => {
    if (isLogin) {
      // 로그인 상태일 때 프로필 데이터가 없으면 API 호출
      if (!profile) {
        refetch();
      }
    } else {
      // 로그아웃 상태일 때 프로필 데이터 초기화
      clearProfile();
    }
  }, [isLogin, profile, refetch, clearProfile]);

  // 로그인 상태가 변경될 때 홈페이지 관련 쿼리들 무효화
  useEffect(() => {
    if (isLogin) {
      // 로그인 시 홈페이지 관련 쿼리들 무효화하여 새로운 데이터를 가져오도록 함
      queryClient.invalidateQueries({ queryKey: ["home"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  }, [isLogin, queryClient]);

  // 데이터를 반환하지 않고 로직만 실행
};
