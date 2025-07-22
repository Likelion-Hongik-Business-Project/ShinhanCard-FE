import Down from "@/assets/svgs/common/down.svg";
import Clock from "@/assets/svgs/common/inquiryList/clock.svg";
import Hash from "@/assets/svgs/common/inquiryList/hash.svg";
import Loader from "@/assets/svgs/common/inquiryList/loader.svg";
import User from "@/assets/svgs/common/inquiryList/user.svg";
import ProfileIcon from "@/assets/svgs/common/profile.svg";
import { INQUIRY_STATUS_COLORS } from "@/constants/inquiry";
import { InquiryListItem } from "@/types/inquiry";

interface InquiryListProps {
  inquiries: InquiryListItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function InquiryList({
  inquiries,
  currentPage,
  totalPages,
  onPageChange,
}: InquiryListProps) {
  return (
    <div className="w-full bg-white rounded-b-[15px] rounded-tr-[15px]">
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
            <Down className="text-gray-50" />
          </th>
          <th className="px-4 flex items-center gap-2 w-[251px] whitespace-nowrap">
            <Clock />
            <span className="text-body1">문의 일시 (전체)</span>
            <Down className="text-gray-50" />
          </th>
        </tr>
      </thead>

      {/* 리스트 */}
      {inquiries.map(item => (
        <div
          key={item.id}
          className="h-16 grid grid-cols-4 gap-4 items-center py-3 border-b text-center hover:bg-gray-50"
        >
          {/* 프로필 */}
          <div className="flex justify-center">
            {item.leftProfiles.length > 0 ? (
              item.leftProfiles.map(profile => (
                <img
                  key={profile.user_id}
                  src={profile.profile_image_url}
                  alt={profile.name}
                  title={profile.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))
            ) : (
              <ProfileIcon className="w-8 h-8 rounded-full border-2 border-white" />
            )}
          </div>

          {/* 제목 */}
          <div>{item.title}</div>

          {/* 상태 */}
          <div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${INQUIRY_STATUS_COLORS[item.status]}`}
            >
              {item.status}
            </span>
          </div>

          {/* 날짜 + 스크랩 */}
          <div className="flex justify-center items-center space-x-1">
            <span>{new Date(item.created_at).toLocaleDateString("ko-KR")}</span>
            {item.is_scraped && <span className="text-yellow-400">⭐</span>}
          </div>
        </div>
      ))}

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
