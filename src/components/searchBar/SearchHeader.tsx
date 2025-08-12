import { Pencil } from "@/assets/svgs/layout";
import Button from "@/components/common/Button";
import ExportDropdown from "@/components/common/ExportDropdown";
import { SearchHeaderProps } from "@/types/search/search";

const SearchHeader = ({ query, total_count }: SearchHeaderProps) => {
  // 엑셀 다운로드 함수
  const handleExport = async (option: "filtered" | "all") => {
    console.log(option);
    // TODO: API 각각 연결
  };

  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-gray-80 text-heading1 mt-[26px]">
          <span className="text-main">'{query}'</span>에 대한 검색 결과
        </h1>
      </div>

      <div className="flex gap-4">
        {total_count > 0 && (
          <div className="self-end">
            <ExportDropdown onExport={handleExport} />
          </div>
        )}

        <Button buttonType="blue">
          <Pencil className="w-4 h-4 text-white hover:text-gray-30" />
          문의 작성
        </Button>
      </div>
    </div>
  );
};

export default SearchHeader;
