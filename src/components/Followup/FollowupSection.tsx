import { useState } from "react";

import clsx from "clsx";

import FollowupForm from "@/components/Followup/FollowupForm";
import FollowupHeader from "@/components/Followup/FollowupHeader";
import FollowupThread from "@/components/Followup/FollowupThread";
import { InquiryData } from "@/types/inquiryTypes";

type Props = {
  inquiry: InquiryData;
};

const FollowupSection = ({ inquiry }: Props) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const hasFollowups = (inquiry.follow_ups?.count ?? 0) > 0;
  const hasGap = isChatOpen || hasFollowups;

  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <div
      className={clsx(
        "w-full max-w-[1420px] rounded-[15px] py-14 px-16 bg-white flex flex-col",
        hasGap ? "gap-8" : "gap-0"
      )}
    >
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
