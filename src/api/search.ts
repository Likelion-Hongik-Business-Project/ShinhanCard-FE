import axios from "axios";

// API 기본 설정
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 최근 검색어 조회
export const getRecentSearchKeywords = async () => {
  try {
    const response = await api.get("/search/inquiries/recent");
    return response.data;
  } catch (error) {
    console.error("최근 검색어 조회 실패:", error);
    throw error;
  }
};

// 최근 검색어 삭제
export const deleteRecentSearchKeyword = async (keyword: string) => {
  try {
    const response = await api.delete(`/search/inquiries/recent`, {
      data: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error("최근 검색어 삭제 실패:", error);
    throw error;
  }
};

// 검색어 추가 (새로운 검색어를 최근 검색어에 추가)
export const addRecentSearchKeyword = async (keyword: string) => {
  try {
    const response = await api.post("/search/inquiries/recent", {
      keyword,
    });
    return response.data;
  } catch (error) {
    console.error("최근 검색어 추가 실패:", error);
    throw error;
  }
};
