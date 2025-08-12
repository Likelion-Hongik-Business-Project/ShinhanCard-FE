import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Search } from "@/assets/svgs/layout";
import RecentSearch from "@/components/searchBar/RecentSearch";
import RecommendSearch from "@/components/searchBar/RecommendSearch";

type Props = {
  onSearchActiveChange?: (isActive: boolean) => void;
};

const SearchBar = ({ onSearchActiveChange }: Props) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 검색 결과 페이지가 아닌 다른 페이지로 이동했을 때 검색창 초기화
    if (
      !location.pathname.includes("/result") &&
      !location.pathname.includes("/inquiries/")
    ) {
      setSearchInput("");
      setIsSearchActive(false);
    }
  }, [location.pathname]);

  const handleSearchFocus = () => {
    setIsSearchActive(true);
    onSearchActiveChange?.(true);
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
    onSearchActiveChange?.(false);
  };

  const handleSearchInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeywordClick = async (keyword: string) => {
    // 검색창에 검색어 입력
    setSearchInput(keyword);

    // 검색 결과 페이지로 이동
    navigate(`/result?query=${encodeURIComponent(keyword)}`);

    // 검색 모달 닫기
    setIsSearchActive(false);
  };

  const handleRecommendCardClick = (inquiry_id: number, title: string) => {
    console.log("추천 카드 클릭:", inquiry_id, title);

    // 검색창에 제목 입력
    setSearchInput(title);

    // 문의글 상세 페이지로 이동
    navigate(`/inquiries/${inquiry_id}`);

    // 검색 모달 닫기
    setIsSearchActive(false);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchInput.trim()) return;

    // 검색 결과 페이지로 이동
    navigate(`/result?query=${encodeURIComponent(searchInput.trim())}`);

    // 검색 모달 닫기
    setIsSearchActive(false);
  };

  return (
    <>
      <form
        onSubmit={handleSearchSubmit}
        className="border border-transparent focus-within:border-gray-60 transition ml-[215px] h-10 w-[640px] 1400:w-[700px] rounded-[30px] bg-gray-10 px-5 flex items-center"
      >
        <Search
          className={`w-5 h-5 ${isSearchActive ? "text-gray-60" : "text-gray-40"}`}
        />
        <input
          type="text"
          placeholder="검색"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="w-full h-full bg-transparent outline-none text-gray-80 text-heading3 ml-4 placeholder:text-gray-60"
          onFocus={handleSearchFocus}
          onClick={handleSearchInputClick}
        />
      </form>

      {/* 검색어가 없을 때만 최근 검색어 표시 */}
      <RecentSearch
        isOpen={isSearchActive && !searchInput.trim()}
        onClose={handleSearchClose}
        onKeywordClick={handleKeywordClick}
      />

      {/* 검색어가 있을 때만 추천 검색어 표시 */}
      <RecommendSearch
        isOpen={isSearchActive && searchInput.trim().length > 0}
        onClose={handleSearchClose}
        query={searchInput}
        onCardClick={handleRecommendCardClick}
      />
    </>
  );
};

export default SearchBar;
