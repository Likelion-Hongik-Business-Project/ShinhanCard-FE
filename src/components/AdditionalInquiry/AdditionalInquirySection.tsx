import { useState } from "react";

import AdditionalInquiryHeader from "@/components/AdditionalInquiry//AdditionalInquiryHeader";
import AdditionalInquiryForm from "@/components/AdditionalInquiry/AdditionalInquiryForm";
import AdditionalInquiryThread from "@/components/AdditionalInquiry/AdditionalInquiryThread";
import { InquiryResponse } from "@/types/InquiryResponse";

type Props = {
  inquiry: InquiryResponse;
};

const AdditionalInquirySection = ({ inquiry }: Props) => {
  // 채팅창 열림 여부
  const [isChatOpen, setIsChatOpen] = useState(false);

  // 토글 함수
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <div className="w-full max-w-[1420px] rounded-[15px] py-14 px-16 bg-white flex flex-col gap-8">
      {/* 헤더에 onClickNew prop으로 토글 함수 전달 */}
      <AdditionalInquiryHeader
        follow_ups_cnt={inquiry.follow_ups.length}
        isChatOpen={isChatOpen}
        onClick={toggleChat}
      />

      {/* isChatOpen이 true일 때만 InquiryForm 렌더 */}
      {isChatOpen && (
        <AdditionalInquiryForm
          assignees={inquiry.assignees}
          onClose={toggleChat}
        />
      )}

      <AdditionalInquiryThread
        assignees={inquiry.assignees}
        writer={inquiry.writer}
        follow_ups={inquiry.follow_ups}
      />
    </div>
  );
};

export default AdditionalInquirySection;
