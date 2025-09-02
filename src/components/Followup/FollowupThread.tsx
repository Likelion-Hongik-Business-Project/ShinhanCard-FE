import { useEffect, useState } from "react";

import { Enter } from "@/assets/svgs/followup";
import FollowUpBody from "@/components/Followup/FollowupBody";
import FollowupCommentForm from "@/components/Followup/FollowupCommentForm";
import FollowupForm from "@/components/Followup/FollowupForm";
import { Assignee, FollowUp } from "@/types/inquiryTypes";

import { useProfileStore } from "@/store/useProfileStore";

type Props = {
  inquiryId: number;
  assignees: Assignee[];
  follow_ups: FollowUp[];
  onRequestEditClose: (followupId: number) => void;
};

const FollowupThread = ({
  inquiryId,
  assignees,
  follow_ups,
  onRequestEditClose,
}: Props) => {
  const [replyTarget, setReplyTarget] = useState<{
    kind: "followup" | "comment";
    id: number;
  } | null>(null);
  const [editFollowUpId, setEditFollowUpId] = useState<number | null>(null);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);

  const currentUserId = useProfileStore(state => state.profile?.id);

  // 편집 닫기 확정 이벤트 수신 → 실제 닫기
  useEffect(() => {
    const onCloseEdit = (e: Event) => {
      const ce = e as CustomEvent<{ followupId: number }>;
      const id = ce.detail?.followupId;
      if (id != null && editFollowUpId === id) {
        setEditFollowUpId(null);
      }
    };
    window.addEventListener("followup:close-edit", onCloseEdit);
    return () => window.removeEventListener("followup:close-edit", onCloseEdit);
  }, [editFollowUpId]);

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
    // 켜기
    if (editFollowUpId !== followUpId) {
      setEditFollowUpId(followUpId);
      setReplyTarget(null);
      setEditCommentId(null);
      return;
    }
    // 끄기 → 가드 경유
    onRequestEditClose(followUpId);
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
          className="flex flex-col border-t border-gray-20 gap-8 pt-8"
        >
          {/* 추가문의(부모) */}
          {editFollowUpId === fu.follow_up_id ? (
            <FollowupForm
              inquiryId={inquiryId}
              followupId={fu.follow_up_id}
              assignees={assignees}
              onClose={() => onRequestEditClose(fu.follow_up_id)} // 닫기 버튼도 가드 경유
              onSubmitSuccess={() => {}}
              onSubmittedClose={() => {
                // 제출 성공 시 편집 종료
                setEditFollowUpId(null);
              }}
              initialContent={fu.content}
              initialAssigneeId={fu.tagged_user.user_id}
            />
          ) : (
            <FollowUpBody
              taggedUser={fu.tagged_user}
              author={fu.author}
              created_at={fu.created_at}
              content={fu.content}
              canEdit={fu.author.user_id === currentUserId}
              onAnswer={() => handleAnswerOpen("followup", fu.follow_up_id)}
              onEdit={() => handleEditFollowUp(fu.follow_up_id)} // 토글 → 가드 경유
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

          {fu.comments && fu.comments.length > 0 && (
            <div className="px-6 py-2 bg-gray-10 rounded-[15px]">
              <div className="flex flex-col">
                {fu.comments.map(c => (
                  <div key={c.comment_id} className="flex gap-4 py-8">
                    <Enter />
                    <div className="flex-1">
                      {editCommentId === c.comment_id ? (
                        <FollowupCommentForm
                          taggedUser={c.tagged_user}
                          followUpId={fu.follow_up_id}
                          commentId={c.comment_id}
                          initialContent={c.content}
                          onClose={handleFormClose}
                        />
                      ) : (
                        <FollowUpBody
                          taggedUser={c.tagged_user}
                          author={c.author}
                          created_at={c.created_at}
                          content={c.content}
                          canEdit={c.author.user_id === currentUserId}
                          onAnswer={() =>
                            handleAnswerOpen("comment", c.comment_id)
                          }
                          onEdit={() => handleEditComment(c.comment_id)}
                        />
                      )}
                    </div>
                  </div>
                ))}

                {replyTarget?.kind === "comment" && (
                  <div className="mb-8">
                    <FollowupCommentForm
                      taggedUser={fu.author}
                      followUpId={fu.follow_up_id}
                      onClose={handleFormClose}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FollowupThread;
