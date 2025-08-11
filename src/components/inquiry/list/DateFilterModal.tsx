import { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import Left from "@/assets/svgs/common/left.svg";
import Right from "@/assets/svgs/common/right.svg";
import { YearMonth } from "@/types/inquiry/inquiryListApi.type";

type Props = {
  selectedItems: YearMonth[];
  onChange: (items: YearMonth[]) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const DateFilterModal = ({
  selectedItems: initialSelected,
  onChange,
  onClose,
  triggerRef,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedItems, setSelectedItems] = useState<YearMonth[]>([
    ...initialSelected,
  ]);

  // 오늘 기준 월 계산
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  // 월 선택 토글 함수
  const toggleMonth = (month: number) => {
    const exists = selectedItems.some(
      item => item.year === year && item.month === month
    );
    if (exists) {
      setSelectedItems(prev =>
        prev.filter(item => !(item.year === year && item.month === month))
      );
    } else {
      setSelectedItems(prev => [...prev, { year, month }]);
    }
  };

  // 필터링 초기화 함수
  const handleReset = () => {
    setSelectedItems([]);
    onChange([]);
    onClose();
  };

  // 모달 영역과 버튼 둘 다 아닌 경우에만 닫힘
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !(triggerRef.current && triggerRef.current.contains(target))
      ) {
        onChange(selectedItems);
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedItems, onClose, onChange, triggerRef]);

  return (
    <div
      ref={modalRef}
      className="absolute mt-[21px] right-0 z-10 w-[520px] px-12 py-10 bg-white shadow-01 rounded-[14px]"
    >
      <div className="flex justify-between items-center mb-6">
        {/* 연도 */}
        <div className="flex gap-1 items-center">
          <Left
            className="w-6 h-6 cursor-pointer text-main"
            onClick={() => setYear(year - 1)}
          />
          <span className="text-heading2-b text-main">{year}</span>
          {year < currentYear && (
            <Right
              className="w-6 h-6 cursor-pointer text-main"
              onClick={() => setYear(year + 1)}
            />
          )}
        </div>
        {/* 초기화 버튼 */}
        <button
          onClick={handleReset}
          className="px-4 py-2 text-detail2 bg-gray-10 text-gray-60 hover:bg-gray-30 transition-colors border border-gray-40 rounded-[5px] cursor-pointer"
        >
          필터링 초기화
        </button>
      </div>

      {/* 월 */}
      <div className="grid grid-cols-3 gap-x-5 gap-y-4">
        {Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;

          // 미래 월이면 렌더링 자체 X
          const isFuture =
            year > currentYear ||
            (year === currentYear && month > currentMonth);

          if (isFuture) return null;

          const isSelected = selectedItems.some(
            item => item.year === year && item.month === month
          );

          return (
            <button
              key={month}
              onClick={() => toggleMonth(month)}
              className={clsx(
                "h-12 rounded-[8px] border w-32 bg-white cursor-pointer",
                isSelected
                  ? "text-main border-main text-body2-b"
                  : "text-gray-60 border-gray-60 text-body2"
              )}
            >
              {month}월
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateFilterModal;
