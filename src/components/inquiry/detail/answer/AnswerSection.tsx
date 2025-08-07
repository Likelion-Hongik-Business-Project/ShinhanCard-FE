// src/components/inquiry/detail/answer/AnswerSection.tsx
import { useState } from "react";

import AnswerItem from "@/components/inquiry/detail/answer/AnswerItem";
import AnswerList from "@/components/inquiry/detail/answer/AnswerList";
import { useAnswerApi } from "@/hooks/inquiry/useAnswerApi";
import { useInquiryManagementApi } from "@/hooks/inquiry/useInquiryManagementApi";
import type { Comment } from "@/types/inquiryTypes";

interface AnswerSectionProps {
  inquiry_id: number;
  team_id: number;
  comments: Comment[];
  currentUserId?: number;
  canAnswer?: boolean;
}

const AnswerSection = ({
  inquiry_id,
  // team_id,
  comments = [],
  currentUserId,
  canAnswer = false,
}: AnswerSectionProps) => {
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    comments.length > 0 ? comments[0].comment_id : null
  );

  // API 훅들
  const {
    // postAnswerMutation,
    // putAnswerMutation,
    // deleteAnswerMutation,
    postInquiryConfirmMutation,
  } = useAnswerApi();
  const { postInquiryNotifyMutation } = useInquiryManagementApi();

  const selectedComment = comments.find(
    comment => comment.comment_id === selectedCommentId
  );

  // 문의 확인 처리
  const handleConfirmInquiry = async () => {
    if (!confirm("문의를 확인 처리하시겠습니까?")) return;

    try {
      await postInquiryConfirmMutation.mutateAsync({ inquiry_id });
    } catch (error) {
      console.error("문의 확인 처리 실패:", error);
    }
  };

  // 알림 메일 발송
  const handleNotifyAssignees = async () => {
    if (!confirm("담당자들에게 알림 메일을 발송하시겠습니까?")) return;

    try {
      await postInquiryNotifyMutation.mutateAsync({ inquiry_id });
      // TODO: 성공 토스트 알림
    } catch (error) {
      console.error("알림 메일 발송 실패:", error);
    }
  };

  return (
    <div className="flex w-full flex-col justify-start items-start rounded-[15px] bg-white px-16 py-14 gap-6">
      {/* 답변 유무에 따라 다른 UI를 렌더링 */}
      {comments.length === 0 ? (
        // ==================================================
        // ▼▼▼ 답변이 없을 때의 UI를 명세에 맞게 재구성 ▼▼▼
        // ==================================================
        <div className="w-full h-[90px] flex flex-col justify-between items-start">
          {/* 1. 답변 헤더 (개수 포함) */}
          <div className="w-full flex items-center gap-2">
            <h2 className="text-heading2-sb text-gray-100">답변</h2>
            <div className="flex h-6 w-9 items-center justify-center rounded-[30px] bg-main">
              <span className="text-body1 text-white">0</span>
            </div>
          </div>
          {/* 2. "아직 답변이 달리지 않았습니다" 텍스트 */}
          <div className="self-stretch flex flex-col items-start">
            <p className="text-heading2-b text-gray-40">
              아직 답변이 달리지 않았습니다!
            </p>
          </div>
        </div>
      ) : (
        // 답변이 있을 때의 UI
        <>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center justify-start gap-2">
              <h2 className="text-heading2-sb text-gray-100">답변</h2>
              <div className="flex h-6 w-9 items-center justify-center rounded-[30px] bg-main">
                <span className="text-body1 text-white">{comments.length}</span>
              </div>
            </div>
            {canAnswer && (
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmInquiry}
                  disabled={postInquiryConfirmMutation.isPending}
                  className="rounded-lg bg-gray-20 px-4 py-2 text-gray-80 hover:bg-gray-30 transition-colors disabled:opacity-50"
                >
                  {postInquiryConfirmMutation.isPending
                    ? "처리중..."
                    : "확인 처리"}
                </button>
                <button
                  onClick={handleNotifyAssignees}
                  disabled={postInquiryNotifyMutation.isPending}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {postInquiryNotifyMutation.isPending
                    ? "발송중..."
                    : "알림 발송"}
                </button>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-col w-full">
            <AnswerList
              comments={comments}
              selectedCommentId={selectedCommentId}
              onSelectComment={setSelectedCommentId}
            />
            {selectedComment && (
              <AnswerItem
                comment={selectedComment}
                isOnlyComment={comments.length === 1}
                currentUserId={currentUserId}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnswerSection;
