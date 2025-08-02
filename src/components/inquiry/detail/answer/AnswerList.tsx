import type { Comment } from "@/types/inquiryTypes";

interface AnswerListProps {
  comments: Comment[];
  selectedCommentId: number | null;
  onSelectComment: (id: number) => void;
}

const AnswerList = ({
  comments,
  selectedCommentId,
  onSelectComment,
}: AnswerListProps) => {
  const uniqueCommenters = comments.reduce((acc, current) => {
    if (!acc.find((item) => item.writer.user_id === current.writer.user_id)) {
      acc.push(current);
    }
    return acc;
  }, [] as Comment[]);

  return (
    <div className="flex items-center gap-6 border-b-2 border-gray-10">
      {uniqueCommenters.map((comment) => (
        <button
          key={comment.writer.user_id}
          onClick={() => onSelectComment(comment.comment_id)}
          className={`border-b-2 px-6 py-4 text-heading3-b transition-colors ${
            selectedCommentId === comment.comment_id
              ? "border-main text-main"
              : "border-transparent text-gray-30"
          }`}
          style={{ marginBottom: "-2px" }}
        >
          {comment.writer.name}
        </button>
      ))}
    </div>
  );
};

export default AnswerList;