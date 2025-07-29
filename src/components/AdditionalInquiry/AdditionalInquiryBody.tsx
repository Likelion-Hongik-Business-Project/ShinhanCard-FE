import { Bubble, UserProfile } from "@/assets/svgs/AdditionalInquiry";

export interface UserInfo {
  name: string;
  profile_image_url: string;
}

export type Props = {
  parentWriter: string;
  writer: UserInfo;
  created_at: string; // ISO 포맷 문자열
  content: string; // Markdown / 개행 포함 텍스트
  canEdit: boolean; // “수정” 버튼 노출 여부
  onAnswer: () => void;
  onEdit: () => void;
};

export const AdditionalInquiryBody = ({
  parentWriter,
  writer,
  created_at,
  content,
  canEdit,
  onAnswer,
  onEdit,
}: Props) => {
  // “2025-07-06T01:00:00Z” → “2025년 07월 06일 01:00”
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const YYYY = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const DD = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${YYYY}년 ${MM}월 ${DD}일 ${hh}:${mm}`;
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 헤더: 프로필 · 이름 · 날짜 */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          {/* <img
            src={writer.profile_image_url}
            alt={writer.name}
            className="w-5 h-5 rounded-full"
          /> */}
          <UserProfile className="w-5 h-5 rounded-full" />
          <span className="text-body1-b text-gray-100">{writer.name}</span>
        </div>
        <span className="text-detail2 text-gray-50">
          {formatDate(created_at)}
        </span>
      </div>

      {/* 본문 */}
      <div className="text-body2 text-gray-800 whitespace-pre-wrap mb-4">
        <span className="text-body2-b text-state-progress-02 ">
          {parentWriter + " "}
        </span>
        {content}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-4">
        <button
          onClick={onAnswer}
          className="flex gap-1 items-center cursor-pointer"
        >
          <Bubble className="w-4 h-4" />
          <span className="text-body2 text-gray-60">답변</span>
        </button>
        {canEdit && (
          <button onClick={onEdit} className="cursor-pointer">
            <span className="text-body2 text-gray-40">수정</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AdditionalInquiryBody;
