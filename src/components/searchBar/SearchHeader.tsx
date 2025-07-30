import Upload from "@/assets/svgs/common/upload.svg";
import { Pencil } from "@/assets/svgs/layout";
import Button from "@/components/common/Button";

interface SearchHeaderProps {
  query: string;
  total_count: number;
}

const SearchHeader = ({ query, total_count }: SearchHeaderProps) => {
  const handleExport = () => {
    alert("엑셀 다운로드 기능");
  };

  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-gray-80 text-heading1 mt-[26px]">
          '<span className="text-main">{query}</span>'에 대한 검색 결과
        </h1>
      </div>

      <div className="flex gap-4">
        {total_count > 0 && (
          <Button className="self-end" onClick={handleExport}>
            <Upload />
            <span className="text-gray-80 text-heading3">Export</span>
          </Button>
        )}

        <Button buttonType="blue">
          <Pencil className="w-4 h-4 text-white" />
          문의 작성
        </Button>
      </div>
    </div>
  );
};

export default SearchHeader;
