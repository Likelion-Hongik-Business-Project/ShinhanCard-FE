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
  const validComments = comments.filter(comment => comment && comment.author);

  // 동일한 작성자의 답변이 여러 개 있을 경우 탭에는 한 번만 표시
  const uniqueCommenters = validComments.reduce((acc, current) => {
    // 이제 current.author는 항상 존재하므로 안전합니다.
    if (!acc.find(item => item.author.user_id === current.author.user_id)) {
      acc.push(current);
    }
    return acc;
  }, [] as Comment[]);

  return (
    <div className="flex items-center gap-6 border-b-2 border-gray-10">
      {uniqueCommenters.map(comment => (
        <button
          key={comment.author.user_id}
          onClick={() => onSelectComment(comment.comment_id)}
          className={`border-b-2 px-6 py-4 text-heading3-b transition-colors ${
            selectedCommentId === comment.comment_id
              ? "border-main text-main"
              : "border-transparent text-gray-30"
          }`}
          style={{ marginBottom: "-2px" }}
        >
          {comment.author.username}
        </button>
      ))}
    </div>
  );
};

export default AnswerList;
