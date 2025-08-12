import { useNavigate } from "react-router-dom";

import { Pencil } from "@/assets/svgs/layout";
import Button from "@/components/common/Button";
import { SearchHeaderProps } from "@/types/search/search";

const SearchHeader = ({ query, total_count }: SearchHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-gray-80 text-heading1 mt-[26px]">
          <span className="text-main">'{query}'</span>에 대한 검색 결과
          {total_count > 0 && (
            <span className="text-gray-60 text-body1 ml-2">
              ({total_count}건)
            </span>
          )}
        </h1>
      </div>

      <Button buttonType="blue" onClick={() => navigate("/inquiry/form")}>
        <Pencil className="w-4 h-4 text-white hover:text-gray-30" />
        문의 작성
      </Button>
    </div>
  );
};

export default SearchHeader;
