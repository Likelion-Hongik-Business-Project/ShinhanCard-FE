import { useEffect, useState } from "react";

import { Xmark } from "@/assets/svgs/layout";
import {
  useDeleteRecentSearchKeyword,
  useRecentSearchKeywords,
} from "@/hooks/search/useSearch";
import { RecentSearchProps } from "@/types/search/search";

import Keyword from "./Keyword";

const RecentSearch = ({
  isOpen,
  onClose,
  onKeywordClick,
}: RecentSearchProps) => {
  const {
    data: searchData,
    isLoading,
    error,
    refetch,
  } = useRecentSearchKeywords();
  const deleteKeywordMutation = useDeleteRecentSearchKeyword();

  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      // SearchBar가 focus될 때마다 최근 검색어 새로 가져오기
      refetch();

      // API 데이터 설정
      if (searchData?.result?.keywords) {
        setKeywords(searchData.result.keywords);
      }

      // 모달 열릴 때 배경 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      // 모달 닫힐 때 배경 스크롤 복원
      document.body.style.overflow = "unset";
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, searchData, refetch]);

  const handleKeywordRemove = async (keywordToRemove: string) => {
    try {
      await deleteKeywordMutation.mutateAsync(keywordToRemove);
      // 성공 시 React Query가 자동으로 데이터를 다시 조회
    } catch (error) {
      console.error("검색어 삭제 실패:", error);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    onKeywordClick?.(keyword);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-start" onClick={onClose}>
      <div className="absolute inset-0 ml-25 mt-16 bg-black-80/40" />

      <div
        className="relative max-w-[880px] min-w-[640px] bg-white rounded-[15px] shadow-lg ml-[347px] mt-16"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-16 py-10">
          <h3 className="text-gray-80 text-body1 mb-6">최근 검색어</h3>

          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-30 border-t-main rounded-full animate-spin"></div>
                <p className="text-gray-60">로딩 중...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center py-8">
              <p className="text-red-500">
                최근 검색어를 불러오는데 실패했습니다.
              </p>
            </div>
          )}

          {!isLoading && !error && keywords.length === 0 && (
            <div className="flex justify-center py-8">
              <p className="text-gray-60">최근 검색어가 없습니다.</p>
            </div>
          )}

          {!isLoading && !error && keywords.length > 0 && (
            <div className="flex flex-wrap gap-[19px]">
              {keywords.map((keyword: string, index: number) => (
                <Keyword
                  key={`${keyword}-${index}`}
                  keyword={keyword}
                  onRemove={handleKeywordRemove}
                  onClick={() => handleKeywordClick(keyword)}
                  isRemoving={deleteKeywordMutation.isPending}
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

export default RecentSearch;
