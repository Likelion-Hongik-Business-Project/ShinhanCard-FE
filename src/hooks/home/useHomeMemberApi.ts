import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { GlobalResponse } from "@/types/common/api.type";
import { GetInterestedMembersResponse } from "@/types/home/homeApi.type";

import {
  deleteRemoveInterestedMember,
  getInterestedMembers,
  postAddInterestedMember,
} from "@/apis/home/homeApi";

// ===== 관심 팀원 관련 훅 =====

//관심 팀원 조회
export const useInterestedMembers = () => {
  return useQuery<GlobalResponse<GetInterestedMembersResponse>>({
    queryKey: ["home", "interested-members"],
    queryFn: getInterestedMembers,
  });
};

//관심 팀원 추가
export const useAddInterestedMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => postAddInterestedMember(userId),
    onSuccess: data => {
      console.log("관심 팀원 추가 성공:", data);
      //요청 성공시 새로고침
      queryClient.invalidateQueries({ queryKey: ["home", "initial"] });
      queryClient.invalidateQueries({
        queryKey: ["home", "interested-members"],
      });
    },
    onError: error => {
      console.error("관심 팀원 추가 실패:", error);
    },
  });
};

//관심 팀원 삭제
export const useRemoveInterestedMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => deleteRemoveInterestedMember(userId),
    onSuccess: data => {
      console.log("관심 팀원 삭제 성공:", data);
      // 요청 성공시 새로고침
      queryClient.invalidateQueries({ queryKey: ["home", "initial"] });
      queryClient.invalidateQueries({
        queryKey: ["home", "interested-members"],
      });
    },
    onError: error => {
      console.error("관심 팀원 삭제 실패:", error);
    },
  });
};
