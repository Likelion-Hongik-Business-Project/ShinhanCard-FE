import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addRecentSearchKeyword,
  deleteRecentSearchKeyword,
  getRecentSearchKeywords,
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

// 최근 검색어 추가 훅
export const useAddRecentSearchKeyword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRecentSearchKeyword,
    onSuccess: () => {
      // 추가 성공 시 최근 검색어 목록을 다시 조회
      queryClient.invalidateQueries({ queryKey: ["recentSearchKeywords"] });
    },
    onError: error => {
      console.error("최근 검색어 추가 실패:", error);
    },
  });
};
