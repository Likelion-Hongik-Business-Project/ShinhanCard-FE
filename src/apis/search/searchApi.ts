import { ApiResponse } from "@/types/common/api.type";
import {
  RecentSearchData,
  RecommendSearchData,
  SearchRequest,
  SearchResultData,
} from "@/types/search/search";

import instance from "@/apis/instance";

// 최근 검색어 조회
export const getRecentSearchKeywords = async (): Promise<
  ApiResponse<RecentSearchData>
> => {
  try {
    const response = await instance.get<ApiResponse<RecentSearchData>>(
      "/api/search/inquiries/recent"
    );
    return response.data;
  } catch (error) {
    console.error("최근 검색어 조회 실패:", error);
    throw error;
  }
};

// 최근 검색어 삭제
export const deleteRecentSearchKeyword = async (
  keyword: string
): Promise<ApiResponse<RecentSearchData>> => {
  try {
    const response = await instance.delete<ApiResponse<RecentSearchData>>(
      `/api/search/inquiries/recent?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data;
  } catch (error) {
    console.error("최근 검색어 삭제 실패:", error);
    throw error;
  }
};

// 추천 검색어 조회
export const getRecommendSearchKeywords = async (
  query: string
): Promise<ApiResponse<RecommendSearchData>> => {
  try {
    const response = await instance.get<ApiResponse<RecommendSearchData>>(
      `/api/search/inquiries/suggestions?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("추천 검색어 조회 실패:", error);
    throw error;
  }
};

// 검색 결과 조회
export const getSearchResults = async (
  request: SearchRequest
): Promise<ApiResponse<SearchResultData>> => {
  try {
    const response = await instance.get<ApiResponse<SearchResultData>>(
      `/api/search/inquiries/results?query=${encodeURIComponent(request.query)}&page=${request.page}&pageSize=${request.pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("검색 결과 조회 실패:", error);
    throw error;
  }
};
