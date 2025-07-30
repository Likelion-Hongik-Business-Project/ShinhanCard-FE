import { useState } from "react";

import { Enter } from "@/assets/svgs/AdditionalInquiry";
import AdditionalInquiryBody from "@/components/AdditionalInquiry/AdditionalInquiryBody";
import { FollowUp, User } from "@/types/InquiryResponse";

import AdditionalInquiryReplyForm from "./AdditionalInquiryReplyForm";

type Props = {
  writer: User;
  follow_ups: FollowUp[];
};

const AdditionalInquiryThread = ({ writer, follow_ups }: Props) => {
  const [replyToId, setReplyToId] = useState<number | null>(null);

  const handleAnswerOpen = (commentId: number) => {
    setReplyToId(prev => (prev === commentId ? null : commentId));
  };

  const handleFormClose = () => {
    setReplyToId(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {follow_ups.map(fu => (
        <div
          key={fu.follow_up_id}
          className="flex flex-col border-t border-gray-20 gap-8 pt-8 "
        >
          {/* 1. 추가문의(부모) */}
          <AdditionalInquiryBody
            recipient={writer.name}
            writer={fu.writer}
            created_at={fu.created_at}
            content={fu.content}
            //c.writer === user.id
            canEdit={true}
            onAnswer={() => handleAnswerOpen(fu.follow_up_id)}
            onEdit={() => console.log("수정 follow-up", fu.follow_up_id)}
          />

          {/* 1-1) 추가문의 답변 폼 */}
          {replyToId === fu.follow_up_id && (
            <div className="">
              <AdditionalInquiryReplyForm
                parenWriter={fu.writer.name}
                onClose={handleFormClose}
              />
            </div>
          )}

          {/* 2. 대댓글(하위) */}
          <div className="py-8 px-6 rounded-[15px] bg-gray-10 flex flex-col gap-8 ">
            {fu.comments.map(c => (
              <div className="flex gap-4" key={c.comment_id}>
                <Enter />
                <div className="flex-1 flex flex-col gap-8">
                  <AdditionalInquiryBody
                    key={c.comment_id}
                    recipient={fu.writer.name}
                    writer={c.writer}
                    created_at={c.created_at}
                    content={c.content}
                    //c.writer === user.id
                    canEdit={true}
                    onAnswer={() => handleAnswerOpen(c.comment_id)}
                    onEdit={() => console.log("수정 comment", c.comment_id)}
                  />
                  {/* 대댓글 답변 폼 */}
                  {replyToId === c.comment_id && (
                    <AdditionalInquiryReplyForm
                      parenWriter={c.writer.name}
                      onClose={handleFormClose}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdditionalInquiryThread;
