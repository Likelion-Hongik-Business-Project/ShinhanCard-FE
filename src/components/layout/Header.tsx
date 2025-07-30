// import { useAddRecentSearchKeyword } from "@/hooks/useSearch";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Down from "@/assets/svgs/common/down.svg";
import Profile from "@/assets/svgs/common/profile.svg";
import { Logo, Menu, Search } from "@/assets/svgs/layout";
import RecentSearch from "@/components/searchBar/RecentSearch";
import RecommendSearch from "@/components/searchBar/RecommendSearch";

type Props = {
  toggleSidebar: () => void;
  onSearchActiveChange?: (isActive: boolean) => void;
};

const Header = ({ toggleSidebar, onSearchActiveChange }: Props) => {
  const user = { name: "장윤영" }; // TODO: 사용자 정보 동적으로 가져오는 로직으로 변경 필요
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  // TODO: 백엔드 API 완료 시 React Query 훅 사용
  // const addKeywordMutation = useAddRecentSearchKeyword();

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
    // TODO: 백엔드 API 완료 시 실제 API 호출로 변경
    // try {
    //   // 검색어를 최근 검색어에 추가
    //   await addKeywordMutation.mutateAsync(keyword);
    //
    //   // 검색창에 검색어 입력
    //   setSearchInput(keyword);
    //
    //   // TODO: 실제 검색 실행 로직
    //   console.log("검색어 클릭:", keyword);
    //
    //   // 검색 모달 닫기
    //   setIsSearchActive(false);
    // } catch (error) {
    //   console.error('검색어 추가 실패:', error);
    //   // 에러 처리 (필요시 토스트 메시지 등 추가)
    // }

    // Mock 데이터 사용 시
    setSearchInput(keyword);
    console.log("검색어 클릭:", keyword);

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

    // TODO: 백엔드 API 완료 시 실제 API 호출로 변경
    // try {
    //   // 검색어를 최근 검색어에 추가
    //   await addKeywordMutation.mutateAsync(searchInput.trim());
    //
    //   // TODO: 실제 검색 실행 로직
    //   console.log("검색 실행:", searchInput.trim());
    //
    //   // 검색 모달 닫기
    //   setIsSearchActive(false);
    // } catch (error) {
    //   console.error('검색어 추가 실패:', error);
    //   // 에러 처리 (필요시 토스트 메시지 등 추가)
    // }

    // Mock 데이터 사용 시
    console.log("검색 실행:", searchInput.trim());

    // 검색 결과 페이지로 이동
    navigate(`/result?query=${encodeURIComponent(searchInput.trim())}`);

    // 검색 모달 닫기
    setIsSearchActive(false);
  };

  return (
    <>
      <header className="fixed h-16 w-full bg-white border-b border-gray-20 pl-9 pr-11 flex items-center justify-between z-100">
        <div className="flex items-center">
          <Menu onClick={toggleSidebar} className="w-6 h-6 cursor-pointer" />
          <Logo className="w-8 h-8 ml-10" />
          <form
            onSubmit={handleSearchSubmit}
            className="border border-transparent focus-within:border-gray-60 transition ml-[215px] h-10 w-[640px] 1400:w-[700px] rounded-[30px] bg-gray-10 px-5 flex items-center"
          >
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="검색"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full h-full bg-transparent outline-none text-gray-80 text-heading3 ml-4 placeholder:text-gray-60 placeholder:text-heading3"
              onFocus={handleSearchFocus}
              onClick={handleSearchInputClick}
            />
          </form>
        </div>
        <div className="flex items-center space-x-7 p-[9px] ml-[86px] cursor-pointer rounded-[8px] hover:bg-gray-10 transition">
          <div className="flex items-center space-x-4">
            <Profile />
            <span className="text-gray-80 text-heading2 whitespace-nowrap">
              {user?.name || "이름"}
            </span>
          </div>
          <Down />
        </div>
      </header>

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

export default Header;
