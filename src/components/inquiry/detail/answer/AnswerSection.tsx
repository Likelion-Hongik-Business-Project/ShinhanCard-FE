import AnswerItem from "@/components/inquiry/detail/answer/AnswerItem";
import AnswerList from "@/components/inquiry/detail/answer/AnswerList";
import type { Comment } from "@/types/inquiryTypes";
import { useState } from "react";

interface AnswerSectionProps {
  comments: Comment[];
  currentUserId?: number;
}

const AnswerSection = ({ comments, currentUserId }: AnswerSectionProps) => {
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    comments.length > 0 ? comments[0].comment_id : null
  );

  const selectedComment = comments.find(
    (comment) => comment.comment_id === selectedCommentId
  );

  return (
    <div className="flex w-full flex-col gap-4 rounded-[15px] bg-white p-14">
      <div className="flex items-center justify-start gap-2">
        <h2 className="text-heading2-sb text-gray-100">답변</h2>
        <div className="flex h-6 w-9 items-center justify-center rounded-[30px] bg-main">
          <span className="font-['Inter'] text-body1 text-white">
            {comments.length}
          </span>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="mt-8">
          <p className="text-heading2-b text-gray-40">
            아직 등록된 답변이 없습니다
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col">
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
      )}
    </div>
  );
};

export default AnswerSection;