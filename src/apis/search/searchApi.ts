import { ApiResponse } from "@/types/common/api.type";
import {
  RecentSearchData,
  RecommendSearchData,
  SearchRequest,
  SearchResultData,
} from "@/types/search/search";

import instance from "@/apis/instance";

// 최근 검색어 조회
export const getRecentSearchKeywords =
  async (): ApiResponse<RecentSearchData> => {
    const response = await instance.get("/api/search/inquiries/recent");
    return response.data;
  };

// 최근 검색어 삭제
export const deleteRecentSearchKeyword = async (
  keyword: string
): ApiResponse<RecentSearchData> => {
  const response = await instance.delete(
    `/api/search/inquiries/recent?keyword=${encodeURIComponent(keyword)}`
  );
  return response.data;
};

// 추천 검색어 조회
export const getRecommendSearchKeywords = async (
  query: string
): ApiResponse<RecommendSearchData> => {
  const response = await instance.get(
    `/api/search/inquiries/suggestions?query=${encodeURIComponent(query)}`
  );
  return response.data;
};

// 검색 결과 조회
export const getSearchResults = async (
  request: SearchRequest
): ApiResponse<SearchResultData> => {
  const response = await instance.get(
    `/api/search/inquiries/results?query=${encodeURIComponent(request.query)}&page=${request.page}&pageSize=${request.pageSize}`
  );
  return response.data;
};
