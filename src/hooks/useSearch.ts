import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteRecentSearchKeyword,
  getRecentSearchKeywords,
  getRecommendSearchKeywords,
  getSearchResults,
} from "@/api/search";

// 최근 검색어 조회 훅
export const useRecentSearchKeywords = () => {
  return useQuery({
    queryKey: ["recentSearchKeywords"],
    queryFn: getRecentSearchKeywords,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 최근 검색어 삭제 훅
export const useDeleteRecentSearchKeyword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecentSearchKeyword,
    onSuccess: () => {
      // 삭제 성공 시 최근 검색어 목록을 다시 조회
      queryClient.invalidateQueries({ queryKey: ["recentSearchKeywords"] });
    },
    onError: error => {
      console.error("최근 검색어 삭제 실패:", error);
    },
  });
};

// 추천 검색어 조회 훅
export const useRecommendSearchKeywords = (query: string) => {
  return useQuery({
    queryKey: ["recommendSearchKeywords", query],
    queryFn: () => getRecommendSearchKeywords(query),
    enabled: query.length > 0,
    staleTime: 1 * 60 * 1000, // 1분
    refetchOnWindowFocus: false, // 창 포커스 시 재요청 방지
    retry: 1, // 실패 시 1번만 재시도
    retryDelay: 1000, // 재시도 간격 1초
  });
};

// 검색 결과 조회 훅
export const useSearchResults = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: ["searchResults", query, page],
    queryFn: () => getSearchResults(query, page),
    enabled: query.length > 0,
    staleTime: 1 * 60 * 1000, // 1분
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
  });
};
