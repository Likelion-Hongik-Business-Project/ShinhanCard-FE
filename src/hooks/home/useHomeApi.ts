import { useQuery } from "@tanstack/react-query";

import { GlobalResponse } from "@/types/common/api.type";
import {
  GetHomeInitialResponse,
  GetUncheckedAnswerResponse,
  GetUncheckedInquiriesResponse,
} from "@/types/home/homeApi.type";

import {
  getHomeInitial,
  getUncheckedAnswer,
  getUncheckedInquiries,
} from "@/apis/home/homeApi";

// 1. 홈페이지 초기 진입 데이터 조회
export const useHomeInitial = () => {
  return useQuery<GlobalResponse<GetHomeInitialResponse>>({
    queryKey: ["home", "initial"],
    queryFn: getHomeInitial,
  });
};

// 2. 미확인 답변 조회
export const useUncheckedAnswer = (teamId: number) => {
  return useQuery<GlobalResponse<GetUncheckedAnswerResponse>>({
    queryKey: ["home", "unchecked-answer", teamId],
    queryFn: () => getUncheckedAnswer(teamId),
    enabled: !!teamId,
  });
};

// 3. 미확인 문의 조회
export const useUncheckedInquiries = (teamId: number) => {
  return useQuery<GlobalResponse<GetUncheckedInquiriesResponse>>({
    queryKey: ["home", "unchecked-inquiries", teamId],
    queryFn: () => getUncheckedInquiries(teamId),
    enabled: !!teamId,
  });
};
