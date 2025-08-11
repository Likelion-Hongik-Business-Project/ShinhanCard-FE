import type { AnswerListProps } from "@/types/inquiryTypes";

const AnswerList = ({
  answerers,
  selectedUserId,
  onSelectUser,
}: AnswerListProps) => {
  return (
    <div className="w-full flex items-center gap-6 border-b-2 border-gray-10">
      {answerers.map(answerer => (
        <button
          key={answerer.user_id}
          onClick={() => onSelectUser(answerer.user_id)}
          className={`border-b-2 px-6 py-4 text-heading3-b transition-colors cursor-pointer mb-[-2px] ${
            selectedUserId === answerer.user_id
              ? "border-main text-main"
              : "border-transparent text-gray-30"
          }`}
        >
          {answerer.username}
        </button>
      ))}
    </div>
  );
};

export default AnswerList;
