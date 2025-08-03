import type { Answerer, Comment, InquiryData } from "@/types/inquiryTypes";

import AnswerEditor from "./AnswerEditor";
import AnswerItem from "./AnswerItem";
import AnswerList from "./AnswerList";

interface AnswerSectionProps {
  inquiry: InquiryData;
  currentUserId: number;
  showEditor: boolean;
  tabsToDisplay: Answerer[];
  selectedUserId: number | null;
  selectedComment: Comment | undefined;
  myComment: Comment | undefined;
  draftContent: string;
  setDraftContent: (content: string) => void;
  handleStartAnswer: () => void;
  handleSelectTab: (id: number) => void;
  handleSubmit: (content: string) => void;
}

// 문의 상세 페이지의 전체 답변 섹션을 렌더링하는 컴포넌트
const AnswerSection = (props: AnswerSectionProps) => {
  const {
    inquiry,
    currentUserId,
    showEditor,
    tabsToDisplay,
    selectedUserId,
    selectedComment,
    myComment,
    draftContent,
    setDraftContent,
    handleStartAnswer,
    handleSelectTab,
    handleSubmit,
  } = props;

  // 답변 섹션의 클래스를 조건부로 설정
  const answerSectionClasses = [
    "flex",
    "w-full",
    "flex-col",
    "justify-between",
    "items-start",
    "rounded-[15px]",
    "bg-white",
    "p-14",
    "gap-8",
    showEditor ? "border-[3px] border-main" : "border-transparent",
  ];

  return (
    <div className={answerSectionClasses.join(" ")}>
      {/* 섹션 제목 및 답변 개수 */}
      <div className="flex items-center justify-start gap-2">
        <h2 className="text-heading2-sb text-gray-100">답변</h2>
        <div className="flex h-6 w-auto min-w-[35px] items-center justify-center rounded-[30px] bg-main px-3">
          <span className="text-body1 text-white">
            {inquiry.comments.length}
          </span>
        </div>
      </div>

      {/* 답변자 탭 목록 */}
      {tabsToDisplay.length > 0 && (
        <AnswerList
          answerers={tabsToDisplay}
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectTab}
        />
      )}

      {/* 답변 내용 (에디터 또는 조회) */}
      {showEditor ? (
        <AnswerEditor
          mode={myComment ? "edit" : "create"}
          initialContent={draftContent}
          onContentChange={setDraftContent}
          onSubmit={handleSubmit}
        />
      ) : selectedComment ? (
        <AnswerItem
          comment={selectedComment}
          isOnlyComment={inquiry.comments.length === 1}
          currentUserId={currentUserId}
          onStartEdit={handleStartAnswer}
        />
      ) : (
        <div className="w-full">
          <p className="text-heading2-b text-gray-40">
            {inquiry.comment_count === 0
              ? "아직 답변이 달리지 않았습니다!"
              : "표시할 답변이 없습니다."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnswerSection;
