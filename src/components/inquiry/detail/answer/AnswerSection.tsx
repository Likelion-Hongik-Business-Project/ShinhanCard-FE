import type { AnswerSectionProps } from "@/types/inquiryTypes";

import AnswerEditor from "./AnswerEditor";
import AnswerItem from "./AnswerItem";
import AnswerList from "./AnswerList";

const AnswerSection = (props: AnswerSectionProps) => {
  const {
    inquiry,
    currentUserId,
    showEditor,
    tabsToDisplay,
    selectedUserId,
    selectedComment,
    draftContent,
    setDraftContent,
    handleStartAnswer,
    handleSelectTab,
    onEditorSubmit,
    onDeleteAnswer,
  } = props;

  // 답변 섹션의 클래스를 조건부로 설정
  const answerSectionClasses = [
    "flex",
    "w-full",
    "flex-col",
    "justify-start",
    "items-start",
    "rounded-[15px]",
    "bg-white",
    "p-14",
    showEditor ? "border-[3px] border-main" : "border-transparent",
  ].join(" ");

  return (
    <div className={answerSectionClasses}>
      {/* 섹션 제목 및 답변 개수 */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <h2 className="text-heading2-sb text-gray-100">답변</h2>
          <div className="flex h-6 w-auto min-w-[35px] items-center justify-center rounded-[30px] bg-main px-3">
            <span className="text-body1 text-white">
              {inquiry.answers.answers.length}
            </span>
          </div>
        </div>
      </div>

      {/* [수정] 답변 탭과 내용을 하나의 div로 묶고, 헤더와의 간격을 mt-6으로 설정 */}
      <div className="w-full mt-6">
        {/* 답변자 탭 목록 */}
        {tabsToDisplay.length > 0 && !showEditor && (
          <AnswerList
            answerers={tabsToDisplay}
            selectedUserId={selectedUserId}
            onSelectUser={handleSelectTab}
          />
        )}

        {/* 답변 내용 */}
        {showEditor ? (
          <AnswerEditor
            initialContent={draftContent}
            onContentChange={setDraftContent}
            onSubmit={onEditorSubmit}
          />
        ) : selectedComment ? (
          <AnswerItem
            comment={selectedComment}
            isOnlyComment={inquiry.answers.answers.length === 1}
            currentUserId={currentUserId}
            onStartEdit={handleStartAnswer}
            onDelete={onDeleteAnswer}
          />
        ) : (
          <div className="w-full h-[90px] flex flex-col justify-center items-start">
            <p className="text-heading2-b text-gray-40">
              {inquiry.answers.count === 0
                ? "아직 답변이 달리지 않았습니다!"
                : "표시할 답변이 없습니다."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerSection;
