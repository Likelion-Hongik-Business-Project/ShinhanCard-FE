import { useState } from "react";

import { Enter } from "@/assets/svgs/AdditionalInquiry";
import AdditionalInquiryBody from "@/components/AdditionalInquiry/AdditionalInquiryBody";
import { Assignee, FollowUp, User } from "@/types/InquiryResponse";

import AdditionalInquiryForm from "./AdditionalInquiryForm";
import AdditionalInquiryReplyForm from "./AdditionalInquiryReplyForm";

type Props = {
  assignees: Assignee[];
  writer: User;
  follow_ups: FollowUp[];
};

const AdditionalInquiryThread = ({ assignees, writer, follow_ups }: Props) => {
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [editFollowUpId, setEditFollowUpId] = useState<number | null>(null);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);

  const handleAnswerOpen = (commentId: number) => {
    setReplyToId(prev => (prev === commentId ? null : commentId));
    setEditFollowUpId(null);
    setEditCommentId(null);
  };

  const handleFormClose = () => {
    setReplyToId(null);
    setEditFollowUpId(null);
    setEditCommentId(null);
  };

  const handleEditFollowUp = (followUpId: number) => {
    setEditFollowUpId(prev => (prev === followUpId ? null : followUpId));
    setReplyToId(null);
    setEditCommentId(null);
  };

  const handleEditComment = (commentId: number) => {
    setEditCommentId(prev => (prev === commentId ? null : commentId));
    setReplyToId(null);
    setEditFollowUpId(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {follow_ups.map(fu => (
        <div
          key={fu.follow_up_id}
          className="flex flex-col border-t border-gray-20 gap-8 pt-8 "
        >
          {/* 1. 추가문의(부모) */}
          {editFollowUpId === fu.follow_up_id ? (
            <AdditionalInquiryForm
              onClose={handleFormClose}
              assignees={assignees}
            />
          ) : (
            <AdditionalInquiryBody
              recipient={writer.name}
              writer={fu.writer}
              created_at={fu.created_at}
              content={fu.content}
              canEdit={true}
              onAnswer={() => handleAnswerOpen(fu.follow_up_id)}
              onEdit={() => handleEditFollowUp(fu.follow_up_id)}
            />
          )}

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
                  {editCommentId === c.comment_id ? (
                    <AdditionalInquiryReplyForm
                      parenWriter={fu.writer.name}
                      onClose={handleFormClose}
                    />
                  ) : (
                    <AdditionalInquiryBody
                      recipient={fu.writer.name}
                      writer={c.writer}
                      created_at={c.created_at}
                      content={c.content}
                      canEdit={true}
                      onAnswer={() => handleAnswerOpen(c.comment_id)}
                      onEdit={() => handleEditComment(c.comment_id)}
                    />
                  )}
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
