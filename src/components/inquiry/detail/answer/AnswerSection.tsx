import { useEffect, useState } from "react";

import clsx from "clsx";

import type { UploadFile } from "@/types/file/file.type";
import type { AnswerSectionProps } from "@/types/inquiryTypes";

import AnswerEditor from "./AnswerEditor";
import AnswerItem from "./AnswerItem";
import AnswerList from "./AnswerList";

const mapServerFilesToUploadList = (
  files: Array<{
    file_id: number;
    file_key: string;
    file_name?: string;
    file_size?: number;
  }>
): UploadFile[] =>
  files.map(f => ({
    id: f.file_id,
    file_id: f.file_id,
    file_name:
      f.file_name ?? decodeURIComponent(f.file_key.split("/").pop() ?? "파일"),
    file_size: f.file_size ?? 0,
    progress: 100,
    status: "done",
  }));

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

  const answerSectionClasses = clsx(
    "flex w-full flex-col justify-start items-start rounded-[15px] bg-white p-14",
    showEditor ? "border-[3px] border-main" : "border-transparent"
  );

  const meId = currentUserId == null ? null : Number(currentUserId);
  const selId = selectedUserId == null ? null : Number(selectedUserId);
  const isMyTabAndWriting =
    meId != null &&
    selId != null &&
    selId === meId &&
    (showEditor || isWritingAnswer);

  useEffect(() => {
    if (!isMyTabAndWriting) return;

    const serverFiles = selectedComment?.files ?? [];
    if (!serverFiles.length) {
      setSelectedFiles([]);
      setSelectedFileIds([]);
      return;
    }

    const mapped = mapServerFilesToUploadList(serverFiles);

    setSelectedFiles(mapped);
    setSelectedFileIds(mapped.map(f => f.file_id!).filter(Boolean));
  }, [isMyTabAndWriting, selectedComment, setSelectedFileIds]);

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
