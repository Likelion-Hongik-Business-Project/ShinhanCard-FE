// import { useSearchResults } from "@/hooks/useSearch";
import { useState } from "react";

import { useSearchParams } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import SearchHeader from "@/components/searchBar/SearchHeader";
import FilterBar from "@/components/TeamBoard/FilterBar";
import InquiryList from "@/components/TeamBoard/InquiryList";
import { searchResultsMockData } from "@/mocks/searchMocks";

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  // TODO: 백엔드 API 완료 시 React Query 훅으로 변경
  // const { data: searchData, isLoading, error } = useSearchResults(query, 1);

  // Mock 데이터 사용 - 초기값으로 설정
  const [searchData] = useState<typeof searchResultsMockData>(
    searchResultsMockData
  );

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = searchData.result.pagination.page_size; // 8개
  const totalPages = Math.ceil(
    searchData.result.pagination.total / ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="w-full h-[835px] bg-gray-10">
      <SearchHeader query={query} total_count={searchData.result.total_count} />

      {searchData.result.total_count === 0 ? (
        <div className="flex justify-center items-center h-163">
          <p className="text-gray-60 text-heading2">검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className="bg-white rounded-[15px] flex flex-col max-h-[652px] overflow-auto">
          <FilterBar />
          <InquiryList inquiries={searchData.result.inquiries} />
        </div>
      )}

      {searchData.result.total_count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
};

export default SearchResultPage;
