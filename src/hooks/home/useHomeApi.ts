import { useQuery } from "@tanstack/react-query";

import { GlobalResponse } from "@/types/common/apiResponse.type";
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
export const useUncheckedAnswer = (teamId: number, page: number = 1) => {
  return useQuery<GlobalResponse<GetUncheckedAnswerResponse>>({
    queryKey: ["home", "unchecked-answer", teamId, page],
    queryFn: () => getUncheckedAnswer(teamId, page),
    enabled: !!teamId,
  });
};

// 3. 미확인 문의 조회
export const useUncheckedInquiries = (teamId: number, page: number = 1) => {
  return useQuery<GlobalResponse<GetUncheckedInquiriesResponse>>({
    queryKey: ["home", "unchecked-inquiries", teamId, page],
    queryFn: () => getUncheckedInquiries(teamId, page),
    enabled: !!teamId,
  });
};
