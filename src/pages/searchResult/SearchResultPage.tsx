// import { useSearchResults } from "@/hooks/useSearch";
import { useState } from "react";

import { useSearchParams } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import InquiryListHeader from "@/components/inquiry/list/InquiryListHeader";
import SearchHeader from "@/components/searchBar/SearchHeader";
import InquiryList from "@/components/TeamBoard/InquiryList";
import { InquiryStatus, YearMonth } from "@/types/inquiry/inquiryListApi.type";
import { searchResultsMockData } from "@/mocks/searchMocks";

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | "전체">(
    "전체"
  );
  const [selectedDate, setSelectedDate] = useState<YearMonth[]>([]);

  // TODO: 백엔드 API 완료 시 React Query 훅으로 변경
  // const { data: searchData, isLoading, error } = useSearchResults(query, 1);

  // Mock 데이터 사용 - 초기값으로 설정
  const [searchData] = useState<typeof searchResultsMockData>(
    searchResultsMockData
  );

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // 페이지당 6개 아이템
  const totalPages = Math.ceil(
    searchData.result.pagination.total / ITEMS_PER_PAGE
  );

  // 현재 페이지 문의 index
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // 현재 페이지 문의들: 추후 API 호출 이후 제거
  const currentItems = searchData.result.inquiries.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 페이지네이션

  // 모달 상태
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 모달 토글 함수: 상태 모달과 일시 모달 둘 중 하나만 열리게
  const toggleStatusModal = () => {
    setIsStatusModalOpen(prev => !prev);
    setIsDateModalOpen(false);
  };

  const toggleDateModal = () => {
    setIsDateModalOpen(prev => !prev);
    setIsStatusModalOpen(false);
  };

  return (
    <section className="w-full h-[835px] bg-gray-10">
      <SearchHeader query={query} total_count={searchData.result.total_count} />

      {searchData.result.total_count === 0 ? (
        <div className="flex justify-center items-center h-163">
          <p className="text-gray-40 text-heading2-b">검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className="bg-white rounded-[15px] flex flex-col">
          <div className="flex justify-end border-b border-gray-10 z-10 ">
            <InquiryListHeader
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              isStatusModalOpen={isStatusModalOpen}
              setIsStatusModalOpen={setIsStatusModalOpen}
              isDateModalOpen={isDateModalOpen}
              setIsDateModalOpen={setIsDateModalOpen}
              toggleStatusModal={toggleStatusModal}
              toggleDateModal={toggleDateModal}
              showAuthor={false}
              showTitle={false}
            />
          </div>
          <InquiryList inquiries={currentItems} />
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
