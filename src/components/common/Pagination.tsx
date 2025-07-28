import Left from "@/assets/svgs/common/left.svg";
import Right from "@/assets/svgs/common/right.svg";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const PAGE_GROUP_SIZE = 5; // 한 그룹에 페이지 버튼 5개
  const currentGroup = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE); // ex. 1 2 3 4 5 -> currentGroup = 0
  const startPage = currentGroup * PAGE_GROUP_SIZE + 1; // ex. 6 7 8 9 10 -> currentGroup = 1 -> startPage = 6
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages); // 해당 그룹에서 마지막 페이지 번호 (ex. < 11 12 > 일 때 12)

  const isFirstGroup = currentGroup === 0; // ex. 1 2 3 4 5
  const isLastGroup = endPage === totalPages; // ex. 11 12

  return (
    <div className="flex justify-center items-center mt-10 gap-[9px]">
      <button
        onClick={() => onPageChange(startPage - PAGE_GROUP_SIZE)}
        disabled={isFirstGroup}
        className="cursor-pointer disabled:text-gray-30"
      >
        <Left className="w-6 h-6" />
      </button>

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
        const page = startPage + i;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-[38px] h-[38px] flex justify-center items-center border rounded-[5px] text-body1 cursor-pointer ${
              currentPage === page
                ? "border-main text-main"
                : "border-gray-50 text-gray-50"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(startPage + PAGE_GROUP_SIZE)}
        disabled={isLastGroup}
        className="cursor-pointer disabled:text-gray-30"
      >
        <Right className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Pagination;
