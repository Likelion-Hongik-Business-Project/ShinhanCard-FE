import { Xmark } from "@/assets/svgs/layout";
import { KeywordProps } from "@/types/search/search";

const Keyword = ({
  keyword,
  onRemove,
  onClick,
  isRemoving = false,
}: KeywordProps) => {
  return (
    <div
      className="h-10 px-4 bg-white cursor-pointer rounded-[12px] border border-gray-20 flex items-center justify-between gap-2 whitespace-nowrap"
      onClick={onClick}
    >
      <span className="text-gray-80 text-body2">{keyword}</span>
      {onRemove && (
        <button
          onClick={e => {
            e.stopPropagation(); // 부모 클릭 이벤트 방지
            onRemove(keyword);
          }}
          disabled={isRemoving}
          className={`w-4 h-4 flex items-center justify-center rounded-full transition cursor-pointer ${
            isRemoving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Xmark className="w-4 h-4 text-gray-60" />
        </button>
      )}
    </div>
  );
};

export default Keyword;
