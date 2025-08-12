import { InquiryType } from "@/types/inbox/inbox.type";

export const getInquiryTypeFromText = (text: string): InquiryType => {
  if (text.includes("답변이 완료되었습니다")) return "ANSWER_COMPLETED";
  if (text.includes("답변을 등록하였습니다")) return "ANSWER_CREATED";
  if (text.includes("담당자로 지정되었습니다")) return "ASSIGNED";
  if (text.includes("참조자로 지정되었습니다")) return "REFERENCED";
  if (text.includes("확인 요청 알림이 도착하였습니다")) return "RE_NOTIFY";
  if (text.includes("언급했습니다")) return "MENTIONED";
  if (text.includes("새 답글")) return "REPLIED";
  if (text.includes("보류되었습니다")) return "PENDING";
  if (text.includes("삭제되었습니다")) return "DELETED";

  return "ANSWER_CREATED";
};
