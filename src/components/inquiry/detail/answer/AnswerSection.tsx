import { useState } from "react";

import clsx from "clsx";

import { UploadFile } from "@/types/file/file.type";
import type { AnswerSectionProps } from "@/types/inquiryTypes";

import AnswerEditor from "./AnswerEditor";
import AnswerItem from "./AnswerItem";
import AnswerList from "./AnswerList";

const AnswerSection = (props: AnswerSectionProps) => {
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
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
    isWritingAnswer,
    selectedFileIds,
    setSelectedFileIds,
    isEditMode,
  } = props;

  // 답변 섹션의 클래스를 조건부로 설정
  const answerSectionClasses = clsx(
    "flex w-full flex-col justify-start items-start rounded-[15px] bg-white p-14",
    showEditor && "border-[3px] border-main",
    !showEditor && "border-transparent"
  );

  // 현재 선택된 사용자가 내 자신이고 답변 작성 중인지 확인
  const isMyTabAndWriting =
    selectedUserId === currentUserId && (showEditor || isWritingAnswer);

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
      <div className="w-full mt-8">
        {/* 답변자 탭 목록 - 답변이 있거나 답변 작성 중일 때 표시 */}
        {tabsToDisplay.length > 0 && (
          <AnswerList
            answerers={tabsToDisplay}
            selectedUserId={selectedUserId}
            onSelectUser={handleSelectTab}
          />
        )}

        {/* 답변 내용 */}
        {isMyTabAndWriting ? (
          // 내 탭이 선택되고 답변 작성 중인 경우 에디터 표시
          <AnswerEditor
            mode={isEditMode ? "edit" : "create"}
            initialContent={draftContent}
            onContentChange={setDraftContent}
            onSubmit={onEditorSubmit}
            fileIds={selectedFileIds}
            files={selectedFiles}
            setFileIds={setSelectedFileIds}
            setFiles={setSelectedFiles}
          />
        ) : selectedComment ? (
          // 선택된 답변이 있는 경우 답변 아이템 표시
          <AnswerItem
            comment={selectedComment}
            isOnlyComment={inquiry.answers.answers.length === 1}
            currentUserId={currentUserId}
            onStartEdit={handleStartAnswer}
            onDelete={onDeleteAnswer}
          />
        ) : (
          // 답변이 없는 경우 빈 상태 메시지 표시
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
