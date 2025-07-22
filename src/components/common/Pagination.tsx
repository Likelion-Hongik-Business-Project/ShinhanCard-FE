import Left from "@/assets/svgs/common/left.svg";
import Right from "@/assets/svgs/common/right.svg";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  return (
    <div className="flex justify-center items-center mt-10 gap-[9px]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={totalPages <= 5 || currentPage === 1}
        className="disabled:text-gray-30 cursor-pointer"
      >
        <Left className="w-6 h-6" />
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`w-[38px] h-[38px] flex justify-center items-center bg-white border rounded-[5px] text-body1 cursor-pointer ${
            currentPage === index + 1
              ? "border-main  text-main"
              : " border-gray-50 text-gray-50"
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={totalPages <= 5 || currentPage === totalPages}
        className="disabled:text-gray-30 cursor-pointer"
      >
        <Right className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Pagination;
