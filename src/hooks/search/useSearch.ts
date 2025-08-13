import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  InquiryServerStatus,
  YearMonth,
} from "@/types/inquiry/inquiryListApi.type";
import { SearchRequest } from "@/types/search/search";

import {
  deleteRecentSearchKeyword,
  getRecentSearchKeywords,
  getRecommendSearchKeywords,
  getSearchResults,
} from "@/apis/search/searchApi";

// 최근 검색어 조회 훅
export const useRecentSearchKeywords = () => {
  return useQuery({
    queryKey: ["recentSearchKeywords"],
    queryFn: getRecentSearchKeywords,
    staleTime: 0, // 캐싱 비활성화 - SearchBar focus 시마다 항상 새로운 API 요청
    refetchOnWindowFocus: true, // SearchBar focus 시 최근 검색어 새로 가져오기
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
export const useSearchResults = (
  query: string,
  page: number = 1,
  pageSize: number = 6,
  status?: InquiryServerStatus,
  date?: YearMonth[]
) => {
  return useQuery({
    queryKey: [
      "inquiries",
      "searchResults",
      query,
      page,
      pageSize,
      status,
      date,
    ],
    queryFn: async () => {
      const request: SearchRequest = {
        query,
        page,
        pageSize,
        status,
        date: date?.map(
          d => `${d.year}-${d.month.toString().padStart(2, "0")}`
        ),
      };
      return getSearchResults(request);
    },
    enabled: query.length > 0,
    staleTime: 0, // 캐싱 비활성화
    gcTime: 0, // 가비지 컬렉션 시간을 0으로 설정하여 즉시 캐시 제거
    refetchOnMount: true, // 컴포넌트 마운트 시 항상 재요청
    refetchOnWindowFocus: false,
    refetchOnReconnect: true, // 네트워크 재연결 시 재요청
    retry: 1,
    retryDelay: 1000,
  });
};
