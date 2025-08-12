import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import InquiryListHeader from "@/components/inquiry/list/InquiryListHeader";
import SearchHeader from "@/components/searchBar/SearchHeader";
import InquiryList from "@/components/TeamBoard/InquiryList";
import { useSearchResults } from "@/hooks/search/useSearch";
import { INQUIRY_STATUS_VALUE } from "@/utils/inquiryStatus";
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
  const ITEMS_PER_PAGE = 10; // 페이지당 10개 아이템

  // 모달 상태
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 필터링 상태가 변경될 때 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedDate]);

  // 검색어가 변경될 때 필터링 상태 초기화
  useEffect(() => {
    setSelectedStatus("전체");
    setSelectedDate([]);
    setCurrentPage(1);
  }, [query]);

  // 검색 결과 조회
  const {
    data: searchData,
    isLoading,
    error,
  } = useSearchResults(
    query,
    currentPage,
    ITEMS_PER_PAGE,
    selectedStatus === "전체"
      ? undefined
      : INQUIRY_STATUS_VALUE[selectedStatus],
    selectedDate.length > 0 ? selectedDate : undefined
  );

  // SearchResultInquiry를 Inquiry로 변환하는 함수
  const convertToInquiry = (searchInquiry: SearchResultInquiry): Inquiry => ({
    inquiry_id: searchInquiry.inquiry_id,
    team_id: searchInquiry.team_id,
    title: searchInquiry.title,
    content_preview: searchInquiry.content_preview,
    status: searchInquiry.inquiry_state,
    created_at: searchInquiry.created_at,
    writer: {
      user_id: 0, // 검색 결과에는 writer 정보가 없으므로 기본값 설정
      name: "작성자", // 기본값 설정
      profile_image_url: "",
    },
    is_scrapped: searchInquiry.is_scrapped,
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

  // 필터링 여부
  const isFiltering =
    selectedStatus !== "전체" || (selectedDate && selectedDate.length > 0);

  // 데이터 여부
  const hasInquiry = (searchData?.result?.total_count || 0) > 0;

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
    <section className="w-full bg-gray-10">
      <SearchHeader
        query={query}
        total_count={searchData?.result?.total_count || 0}
      />

      {/* 검색 결과가 없을 때 (필터링이 아닌 경우) */}
      {!hasInquiry && !isFiltering ? (
        <div className="flex justify-center items-center h-163">
          <p className="text-gray-40 text-heading2-b">검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className="bg-white rounded-[15px] flex flex-col">
          <div className="flex justify-end border-b border-gray-10 z-10">
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

          {hasInquiry ? (
            <InquiryList inquiries={currentItems} />
          ) : (
            <div className="flex items-center justify-center">
              {/* 필터링 결과가 없을 때는 메시지를 표시하지 않음 */}
            </div>
          )}
        </div>
      )}

      {totalPages > 0 && (
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
