import Down from "@/assets/svgs/common/down.svg";
import Clock from "@/assets/svgs/common/inquiryList/clock.svg";
import Hash from "@/assets/svgs/common/inquiryList/hash.svg";
import Loader from "@/assets/svgs/common/inquiryList/loader.svg";
import User from "@/assets/svgs/common/inquiryList/user.svg";
import ProfileIcon from "@/assets/svgs/common/profile.svg";
import Star from "@/assets/svgs/common/star.svg";
import StarActive from "@/assets/svgs/common/star-active.svg";
import { INQUIRY_STATUS_STYLES } from "@/constants/inquiry";
import { InquiryListItem } from "@/types/inquiry";

type Props = {
  inquiries: InquiryListItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function InquiryList({
  inquiries,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div>
      <div className="w-full bg-white overflow-hidden rounded-b-[15px] rounded-tr-[15px]">
        {/* 헤더 */}
        <thead className="h-16 flex text-gray-60 border-[2px] border-gray-10 items-center">
          <tr className="flex w-full">
            <th className="ml-20 px-4 flex items-center gap-2 w-40 whitespace-nowrap">
              <User />
              <span className="text-body1">작성자</span>
            </th>
            <th className="px-4 flex flex-1 items-center gap-2 min-w-[477px] whitespace-nowrap">
              <Hash />
              <span className="text-body1">문의 제목</span>
            </th>
            <th className="px-4 flex items-center gap-2 w-40 whitespace-nowrap">
              <Loader />
              <span className="text-body1">문의 상태</span>
              <Down className="text-gray-50 cursor-pointer" />
            </th>
            <th className="px-4 flex items-center gap-2 w-[251px] whitespace-nowrap">
              <Clock />
              <span className="text-body1">문의 일시 (전체)</span>
              <Down className="text-gray-50 cursor-pointer" />
            </th>
          </tr>
        </thead>

        {/* 리스트 */}
        {inquiries.map(item => (
          <li
            key={item.id}
            className="h-16 border-b-[2px] border-x-[2px] border-gray-10 bg-white flex w-full"
          >
            {/* 스크랩 */}
            <div className="px-4 w-20 flex items-center">
              {item.is_scraped ? <StarActive /> : <Star />}
            </div>
            {/* 프로필 */}
            <div className="px-4 w-40 flex items-center gap-2">
              {item.leftProfiles.length > 0 && (
                <>
                  {item.leftProfiles[0].profile_image_url ? (
                    <img
                      src={item.leftProfiles[0].profile_image_url}
                      alt={item.leftProfiles[0].name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <ProfileIcon className="w-6 h-6 rounded-full" />
                  )}
                  <span className="text-body1 text-gray-100">
                    {item.leftProfiles[0].name}
                  </span>
                </>
              )}
            </div>

            {/* 제목 */}
            <span className="text-body1 flex items-center text-gray-100 flex-1 min-w-[468px] px-4">
              {item.title}
            </span>

            {/* 상태 */}
            <div className="w-40 px-4 flex items-center">
              <div
                className={`flex items-center pl-2 pr-3 gap-2 h-8 rounded-[30px] ${INQUIRY_STATUS_STYLES[item.status].bg} ${INQUIRY_STATUS_STYLES[item.status].text}`}
              >
                <div
                  className={`rounded-full w-2 h-2 ${INQUIRY_STATUS_STYLES[item.status].dot}`}
                />
                <span className="text-body1">{item.status}</span>
              </div>
            </div>

            {/* 날짜 */}
            <div className="w-[252px] flex items-center px-4">
              <span className="text-gray-100 text-body1">
                {new Date(item.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </li>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "border"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
