import instance from "@/apis/instance";

// 최근 검색어 조회
export const getRecentSearchKeywords = async () => {
  try {
    const response = await instance.get("/search/inquiries/recent");
    return response.data;
  } catch (error) {
    console.error("최근 검색어 조회 실패:", error);
    throw error;
  }
};

// 최근 검색어 삭제
export const deleteRecentSearchKeyword = async (keyword: string) => {
  try {
    const response = await instance.delete(`/search/inquiries/recent`, {
      data: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error("최근 검색어 삭제 실패:", error);
    throw error;
  }
};

// 추천 검색어 조회
export const getRecommendSearchKeywords = async (query: string) => {
  try {
    const response = await instance.get(
      `/search/inquiries/suggestions?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("추천 검색어 조회 실패:", error);
    throw error;
  }
};

// 검색 결과 조회
export const getSearchResults = async (query: string, page: number = 1) => {
  try {
    const response = await instance.get(
      `/search/inquiries/results?query=${query}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("검색 결과 조회 실패:", error);
    throw error;
  }
};
