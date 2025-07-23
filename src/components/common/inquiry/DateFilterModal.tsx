import { useEffect, useRef, useState } from "react";

import clsx from "clsx";

export type YearMonth = { year: number; month: number };

type Props = {
  selectedItems: YearMonth[];
  onChange: (items: YearMonth[]) => void;
  onClose: () => void;
  clickedButton: boolean;
  setClickedButton: (value: boolean) => void;
};

const DateFilterModal = ({
  selectedItems: initialSelected,
  onChange,
  onClose,
  clickedButton,
  setClickedButton,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedItems, setSelectedItems] = useState<YearMonth[]>([
    ...initialSelected,
  ]);

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

  const handleReset = () => {
    setSelectedItems([]);
    onChange([]);
    onClose();
  };

  const handleApply = () => {
    onChange(selectedItems);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !clickedButton &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
      setClickedButton(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clickedButton]);

  return (
    <div
      ref={modalRef}
      className="absolute top-14 right-0 z-10 w-[320px] p-6 bg-white shadow-md rounded-[20px] border border-gray-20"
    >
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setYear(year - 1)}>&lt;</button>
        <span className="text-heading2-b text-main">{year}</span>
        <button onClick={() => setYear(year + 1)}>&gt;</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const isSelected = selectedItems.some(
            item => item.year === year && item.month === month
          );
          return (
            <button
              key={month}
              onClick={() => toggleMonth(month)}
              className={clsx(
                "h-12 rounded-[10px] border",
                isSelected
                  ? "text-main border-main font-bold"
                  : "text-gray-40 border-gray-40"
              )}
            >
              {month}월
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-body1 text-gray-40 border border-gray-40 rounded-[10px]"
        >
          필터링 초기화
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 text-body1 text-main border border-main rounded-[10px]"
        >
          적용
        </button>
      </div>
    </div>
  );
};

export default DateFilterModal;
