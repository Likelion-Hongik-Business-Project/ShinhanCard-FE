import { useState } from "react";

import { Enter } from "@/assets/svgs/AdditionalInquiry";
import AdditionalInquiryBody from "@/components/AdditionalInquiry/AdditionalInquiryBody";
import { Assignee, FollowUp } from "@/types/InquiryResponse";

import AdditionalInquiryForm from "./AdditionalInquiryForm";
import AdditionalInquiryReplyForm from "./AdditionalInquiryReplyForm";

type Props = {
  inquiryId: number;
  assignees: Assignee[];
  follow_ups: FollowUp[];
};

const AdditionalInquiryThread = ({
  inquiryId,
  assignees,
  follow_ups,
}: Props) => {
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
          {/* 추가문의(부모) */}
          {editFollowUpId === fu.follow_up_id ? (
            <AdditionalInquiryForm
              inquiryId={inquiryId}
              followupId={fu.follow_up_id}
              assignees={assignees}
              onClose={handleFormClose}
              initialContent={fu.content}
              initialAssigneeId={fu.tagged_user.user_id}
            />
          ) : (
            <AdditionalInquiryBody
              taggedUser={fu.tagged_user}
              author={fu.author}
              created_at={fu.created_at}
              content={fu.content}
              canEdit={true} // 수정 여부 fu.author.user_id === 로그인한 사용자 ID
              onAnswer={() => handleAnswerOpen(fu.follow_up_id)}
              onEdit={() => handleEditFollowUp(fu.follow_up_id)}
            />
          )}

          {/* 추가문의 댓글 입력 */}
          {replyToId === fu.follow_up_id && (
            <AdditionalInquiryReplyForm
              taggedUser={fu.author}
              followUpId={fu.follow_up_id}
              onClose={handleFormClose}
            />
          )}

          {/* 추가문의 댓글(하위) */}
          <div className="py-8 px-6 rounded-[15px] bg-gray-10 flex flex-col gap-8 ">
            {fu.comments.map(c => (
              <div className="flex flex-col gap-8" key={c.comment_id}>
                {editCommentId === c.comment_id ? (
                  /* 추가문의 댓글(하위) 수정 */
                  <AdditionalInquiryReplyForm
                    taggedUser={c.tagged_user}
                    followUpId={fu.follow_up_id}
                    commentId={c.comment_id}
                    initialContent={c.content}
                    onClose={handleFormClose}
                  />
                ) : (
                  <div className="flex gap-4">
                    <Enter />
                    <div className="flex-1">
                      <AdditionalInquiryBody
                        taggedUser={c.tagged_user}
                        author={c.author}
                        created_at={c.created_at}
                        content={c.content}
                        canEdit={true} // 수정 여부 c.author.user_id === 로그인한 사용자 ID
                        onAnswer={() => handleAnswerOpen(c.comment_id)}
                        onEdit={() => handleEditComment(c.comment_id)}
                      />
                    </div>
                  </div>
                )}

                {/* 추가문의 댓글(하위) 입력 폼*/}
                {replyToId === c.comment_id && (
                  <AdditionalInquiryReplyForm
                    taggedUser={c.author}
                    followUpId={fu.follow_up_id}
                    onClose={handleFormClose}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdditionalInquiryThread;
