// import { useRecommendSearchKeywords } from "@/hooks/useSearch";
import { useEffect, useState } from "react";

import { Xmark } from "@/assets/svgs/layout";
import { RecommendSearchProps } from "@/types/search";
import { recommendSearchMockData } from "@/mocks/searchMocks";

import RecommendCard from "./RecommendCard";

const RecommendSearch = ({
  isOpen,
  onClose,
  query,
  onCardClick,
}: RecommendSearchProps) => {
  // TODO: 백엔드 API 완료 시 React Query 훅으로 변경
  // const { data: searchData, isLoading, error } = useRecommendSearchKeywords(query);

  // Mock 데이터 사용
  const [searchData, setSearchData] = useState<
    typeof recommendSearchMockData | null
  >(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && query.trim()) {
      // Mock 데이터 로딩 시뮬레이션 (실제 API 연동 시 제거)
      setIsLoading(true);
      setTimeout(() => {
        setSearchData(recommendSearchMockData);
        setError(null);
        setIsLoading(false);
      }, 300); // 300ms 로딩 시뮬레이션

      // 모달 열릴 때 배경 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      // 모달 닫힐 때 배경 스크롤 복원
      document.body.style.overflow = "unset";
    }

    // 모달이 닫히면 선택 상태 초기화
    if (!isOpen) {
      setSelectedCardId(null);
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, query]);

  const handleCardClick = (inquiry_id: number, title: string) => {
    setSelectedCardId(inquiry_id);

    setTimeout(() => {
      onCardClick?.(inquiry_id, title);
    }, 100);
  };

  if (!isOpen || !query.trim()) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-start" onClick={onClose}>
      <div className="absolute inset-0 ml-25 mt-16 bg-black/40" />

      <div
        className="relative w-[880px] max-w-[calc(100vw-400px)] min-w-[640px] bg-white rounded-[15px] shadow-lg ml-[347px] mt-16"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-10">
          <h3 className="text-gray-80 text-body1 pl-6 mb-6">
            검색결과 (총{" "}
            <span className="text-main text-body1-b">
              {searchData?.total_count || 0}
            </span>
            건)
          </h3>

          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-30 border-t-main rounded-full animate-spin"></div>
                <p className="text-gray-60">검색 중...</p>
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex justify-center py-8">
              <p className="text-red-500">
                추천 검색어를 불러오는데 실패했습니다.
              </p>
            </div>
          )}

          {!isLoading &&
            !error &&
            searchData &&
            searchData.results.length === 0 && (
              <div className="flex justify-center py-8">
                <p className="text-gray-60">검색 결과가 없습니다.</p>
              </div>
            )}

          {!isLoading &&
            !error &&
            searchData &&
            searchData.results.length > 0 && (
              <div>
                {searchData.results.slice(0, 5).map(result => (
                  <RecommendCard
                    key={result.inquiry_id}
                    title={result.title}
                    group_name={result.group_name}
                    division_name={result.division_name}
                    team_name={result.team_name}
                    query={query}
                    isSelected={selectedCardId === result.inquiry_id}
                    onClick={() =>
                      handleCardClick(result.inquiry_id, result.title)
                    }
                  />
                ))}
              </div>
            )}
        </div>

        <div className="h-16 px-6 flex items-center rounded-b-[15px] justify-end border-t bg-gray-10 border-gray-20">
          <button
            onClick={onClose}
            className="text-gray-60 cursor-pointer hover:text-gray-80 transition flex items-center gap-2"
          >
            <p className="text-detail1">닫기</p>
            <Xmark className="w-4 h-4 text-gray-30" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendSearch;
