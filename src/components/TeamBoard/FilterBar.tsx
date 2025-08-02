import { Clock, Loader } from "@/assets/svgs/board";
import Arrow from "@/assets/svgs/common/down.svg";

const FilterBar = () => {
  return (
    <div className="flex h-16 justify-end items-center border-b border-gray-10 pr-8">
      <div className="flex items-center px-4 gap-2 cursor-pointer ">
        <Loader className="w-5 h-5 text-gray-60" />
        <span className="text-body1 text-gray-60">문의 상태</span>
        <span className="w-6 h-6 flex justify-center items-center">
          <Arrow className="w-[14px] h-[8px] text-gray-50" />
        </span>
      </div>
      <div className="flex items-center px-4 gap-2 cursor-pointer ">
        <Clock className="w-5 h-5 text-gray-40" />
        <span className="text-body1 text-gray-60">문의 일시 (전체)</span>
        <Arrow className="w-6 h-6 text-gray-50" />
      </div>
    </div>
  );
};

export default FilterBar;
