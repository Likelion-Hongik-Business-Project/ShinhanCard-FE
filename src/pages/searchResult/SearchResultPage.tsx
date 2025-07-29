import { useSearchParams } from "react-router-dom";

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  return (
    <section className="w-full h-[835px] bg-gray-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">검색 결과</h1>
        {query ? (
          <p className="text-lg">
            <span className="font-semibold">"{query}"</span>에 대한 검색
            결과입니다.
          </p>
        ) : (
          <p className="text-lg text-gray-600">검색어가 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default SearchResultPage;
