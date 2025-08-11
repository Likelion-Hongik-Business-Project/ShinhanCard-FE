import { useState } from "react";

import FollowupForm from "@/components/Followup/FollowupForm";
import FollowupHeader from "@/components/Followup/FollowupHeader";
import FollowupThread from "@/components/Followup/FollowupThread";
import { InquiryResponse } from "@/types/InquiryResponse";

type Props = {
  inquiry: InquiryResponse;
};

const FollowupSection = ({ inquiry }: Props) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <div className="w-full max-w-[1420px] rounded-[15px] py-14 px-16 bg-white flex flex-col gap-8">
      {/* 헤더에 onClickNew prop으로 토글 함수 전달 */}
      <FollowupHeader
        follow_ups_cnt={inquiry.follow_ups.count}
        isChatOpen={isChatOpen}
        onClick={handleToggleChat}
      />

      {/* isChatOpen이 true일 때만 InquiryForm 렌더 */}
      {isChatOpen && (
        <FollowupForm
          inquiryId={inquiry.inquiry_id}
          assignees={inquiry.assignees}
          onClose={handleToggleChat}
        />
      )}

      <FollowupThread
        inquiryId={inquiry.inquiry_id}
        assignees={inquiry.assignees}
        follow_ups={inquiry.follow_ups.follow_ups}
      />
    </div>
  );
};

export default FollowupSection;
