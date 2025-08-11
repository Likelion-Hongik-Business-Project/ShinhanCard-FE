import { useState } from "react";

import { Enter } from "@/assets/svgs/followup";
import FollowUpBody from "@/components/Followup/FollowupBody";
import FollowupCommentForm from "@/components/Followup/FollowupCommentForm";
import FollowUpForm from "@/components/Followup/FollowupForm";
import { Assignee, FollowUp } from "@/types/inquiryTypes";

type Props = {
  inquiryId: number;
  assignees: Assignee[];
  follow_ups: FollowUp[];
};

const FollowupThread = ({ inquiryId, assignees, follow_ups }: Props) => {
  const [replyTarget, setReplyTarget] = useState<{
    kind: "followup" | "comment";
    id: number;
  } | null>(null);
  const [editFollowUpId, setEditFollowUpId] = useState<number | null>(null);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);

  const handleAnswerOpen = (kind: "followup" | "comment", id: number) => {
    setReplyTarget(prev =>
      prev && prev.kind === kind && prev.id === id ? null : { kind, id }
    );
    setEditFollowUpId(null);
    setEditCommentId(null);
  };

  const handleFormClose = () => {
    setReplyTarget(null);
    setEditFollowUpId(null);
    setEditCommentId(null);
  };

  const handleEditFollowUp = (followUpId: number) => {
    setEditFollowUpId(prev => (prev === followUpId ? null : followUpId));
    setReplyTarget(null);
    setEditCommentId(null);
  };

  const handleEditComment = (commentId: number) => {
    setEditCommentId(prev => (prev === commentId ? null : commentId));
    setReplyTarget(null);
    setEditFollowUpId(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {follow_ups?.map(fu => (
        <div
          key={fu.follow_up_id}
          className="flex flex-col border-t border-gray-20 gap-8 pt-8 "
        >
          {/* 추가문의(부모) */}
          {editFollowUpId === fu.follow_up_id ? (
            <FollowUpForm
              inquiryId={inquiryId}
              followupId={fu.follow_up_id}
              assignees={assignees}
              onClose={handleFormClose}
              initialContent={fu.content}
              initialAssigneeId={fu.tagged_user.user_id}
            />
          ) : (
            <FollowUpBody
              taggedUser={fu.tagged_user}
              author={fu.author}
              created_at={fu.created_at}
              content={fu.content}
              canEdit={true} // 수정 여부 fu.author.user_id === 로그인한 사용자 ID
              onAnswer={() => handleAnswerOpen("followup", fu.follow_up_id)}
              onEdit={() => handleEditFollowUp(fu.follow_up_id)}
            />
          )}

          {/* 추가문의 댓글 입력 */}
          {replyTarget?.kind === "followup" &&
            replyTarget.id === fu.follow_up_id && (
              <FollowupCommentForm
                taggedUser={fu.author}
                followUpId={fu.follow_up_id}
                onClose={handleFormClose}
              />
            )}

          {/* 추가문의 댓글(하위) */}
          {fu.comments &&
            fu.comments.length > 0 &&
            fu.comments.map(c => (
              <div className="flex flex-col gap-8" key={c.comment_id}>
                {editCommentId === c.comment_id ? (
                  /* 추가문의 댓글(하위) 수정 */
                  <FollowupCommentForm
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
                      <FollowUpBody
                        taggedUser={c.tagged_user}
                        author={c.author}
                        created_at={c.created_at}
                        content={c.content}
                        canEdit={true} // 수정 여부 c.author.user_id === 로그인한 사용자 ID
                        onAnswer={() =>
                          handleAnswerOpen("comment", c.comment_id)
                        }
                        onEdit={() => handleEditComment(c.comment_id)}
                      />
                    </div>
                  </div>
                )}

                {/* 추가문의 댓글(하위) 입력 폼*/}
                {replyTarget?.kind === "comment" &&
                  replyTarget.id === c.comment_id && (
                    <FollowupCommentForm
                      taggedUser={c.author}
                      followUpId={fu.follow_up_id}
                      onClose={handleFormClose}
                    />
                  )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default FollowupThread;
