import { useMutation } from "@tanstack/react-query";

import { addInterestedMember } from "@/apis/home/homeApi";

export const useAddInterestedMember = () => {
  return useMutation({
    mutationFn: (userId: number) => addInterestedMember(userId),
    onSuccess: data => {
      console.log("관심 팀원 추가 성공:", data);
      // 성공 시 필요한 로직 추가 (예: 토스트 메시지, 캐시 무효화 등)
    },
    onError: error => {
      console.error("관심 팀원 추가 실패:", error);
      // 에러 시 필요한 로직 추가 (예: 에러 토스트 메시지 등)
    },
  });
};
