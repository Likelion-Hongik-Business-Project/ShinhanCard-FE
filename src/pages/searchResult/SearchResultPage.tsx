import { useState } from "react";

import { useSearchParams } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import InquiryListHeader from "@/components/inquiry/list/InquiryListHeader";
import SearchHeader from "@/components/searchBar/SearchHeader";
import InquiryList from "@/components/TeamBoard/InquiryList";
import { useSearchResults } from "@/hooks/search/useSearch";
import { InquiryStatus, YearMonth } from "@/types/inquiry/inquiryListApi.type";
import { SearchResultInquiry } from "@/types/search/search";
import { Inquiry } from "@/types/teamInquires/teamInquiresApi.type";

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | "전체">(
    "전체"
  );
  const [selectedDate, setSelectedDate] = useState<YearMonth[]>([]);

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // 페이지당 6개 아이템

  // 모달 상태
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 검색 결과 조회
  const {
    data: searchData,
    isLoading,
    error,
  } = useSearchResults(query, currentPage, ITEMS_PER_PAGE);

  // SearchResultInquiry를 Inquiry로 변환하는 함수
  const convertToInquiry = (searchInquiry: SearchResultInquiry): Inquiry => ({
    inquiry_id: searchInquiry.inquiry_id,
    title: searchInquiry.title,
    contentPreview: searchInquiry.content_preview,
    status: searchInquiry.inquiry_state,
    created_at: searchInquiry.created_at,
    writer: {
      user_id: 0, // 검색 결과에는 writer 정보가 없으므로 기본값 설정
      name: "작성자", // 기본값 설정
      profile_image_url: "",
    },
    is_scraped: searchInquiry.is_scrapped,
    group_name: searchInquiry.group_name,
    division_name: searchInquiry.division_name,
    team_name: searchInquiry.team_name,
  });

  const totalPages = Math.ceil(
    (searchData?.result?.pagination.total || 0) / ITEMS_PER_PAGE
  );
  const currentItems: Inquiry[] = (searchData?.result?.inquiries || []).map(
    convertToInquiry
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 모달 토글 함수: 상태 모달과 일시 모달 둘 중 하나만 열리게
  const toggleStatusModal = () => {
    setIsStatusModalOpen(prev => !prev);
    setIsDateModalOpen(false);
  };

  const toggleDateModal = () => {
    setIsDateModalOpen(prev => !prev);
    setIsStatusModalOpen(false);
  };

  if (isLoading) {
    return (
      <section className="w-full h-[835px] bg-gray-10">
        <div className="flex justify-center items-center h-full">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-gray-30 border-t-main rounded-full animate-spin"></div>
            <p className="text-gray-60">검색 중...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-[835px] bg-gray-10">
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">검색 결과를 불러오는데 실패했습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-[835px] bg-gray-10">
      <SearchHeader
        query={query}
        total_count={searchData?.result?.total_count || 0}
      />

      {!searchData?.result?.total_count ||
      searchData.result.total_count === 0 ? (
        <div className="flex justify-center items-center h-163">
          <p className="text-gray-40 text-heading2-b">검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className="bg-white rounded-[15px] flex flex-col max-h-[652px] overflow-auto">
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

      {searchData?.result?.total_count && searchData.result.total_count > 0 && (
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
