import { useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";

import InquiryLeaveModal from "@/components/inquiry/common/InquiryLeaveModal";
import { useLeaveGuard } from "@/hooks/inquiry/useLeaveGuard";
import {
  buildFileSig,
  mapServerFilesToUploadList,
} from "@/utils/leaveModalUtils";
import type { UploadFile } from "@/types/file/file.type";
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

  const guardEnabled = showEditor || isWritingAnswer;

  // 파일 시그니처(임시/완료 포함)
  const fileSig = useMemo(() => buildFileSig(selectedFiles), [selectedFiles]);

  const prevFilesDigestRef = useRef<string>("");
  useEffect(() => {
    if (!guardEnabled) return;

    const digest = JSON.stringify({
      ids: (selectedFileIds ?? []).slice().sort((a, b) => a - b),
      sig: fileSig,
    });

    if (prevFilesDigestRef.current === "") {
      // 최초 진입 시 클린 상태 브로드캐스트(선택 사항)
      window.dispatchEvent(
        new CustomEvent("followup:dirty", {
          detail: { dirty: false, reason: "files-init", key: "answer:files" },
        })
      );
    } else if (digest !== prevFilesDigestRef.current) {
      // 파일 목록/상태가 달라지면 더티로 브로드캐스트
      window.dispatchEvent(
        new CustomEvent("followup:dirty", {
          detail: { dirty: true, reason: "files-change", key: "answer:files" },
        })
      );
      // 같은 틱 경합 보강
      queueMicrotask(() =>
        window.dispatchEvent(
          new CustomEvent("followup:dirty", {
            detail: {
              dirty: true,
              reason: "files-change",
              key: "answer:files",
            },
          })
        )
      );
    }
    prevFilesDigestRef.current = digest;
  }, [guardEnabled, selectedFileIds, fileSig]);

  // Answer 전용 이탈 가드 (로컬 액션만 가드, 라우터 차단 X)
  const {
    modalProps: leaveModalForAnswer,
    setBaseline,
    setClean,
    runWithBypass,
    tryLeave,
  } = useLeaveGuard(
    { content: draftContent ?? "", fileIds: selectedFileIds, fileSig },
    {
      enabled: guardEnabled,
      initializeClean: false, // 기준선은 세션 전환시 useEffect에서 설정
      beforeUnload: true,
      eventPrefixes: ["answer:"], // editor 변화 + files-change 모두 "answer:"로 브로드캐스트
      routerBlock: false, // ← 페이지 훅과 충돌 방지
    }
  );

  const sessionKey = useMemo(() => {
    const targetId = selectedComment?.answer_id ?? "none";
    return `${isMyTabAndWriting ? "on" : "off"}|${isEditMode ? "edit" : "create"}|${targetId}`;
  }, [isMyTabAndWriting, isEditMode, selectedComment]);

  // 세션키가 바뀌는 순간에만 baseline 및 초기 파일 세팅
  const lastSessionKeyRef = useRef<string>("");
  useEffect(() => {
    if (!isMyTabAndWriting) {
      lastSessionKeyRef.current = sessionKey;
      setSelectedFiles([]);
      setSelectedFileIds([]);
      // 세션 종료 시 파일 더티도 클린으로 브로드캐스트
      window.dispatchEvent(
        new CustomEvent("followup:dirty", {
          detail: { dirty: false, reason: "files-reset", key: "answer:files" },
        })
      );
      prevFilesDigestRef.current = "";
      return;
    }

    if (lastSessionKeyRef.current === sessionKey) return;
    lastSessionKeyRef.current = sessionKey;

    const serverFiles = selectedComment?.files ?? [];
    if (!serverFiles.length) {
      setSelectedFiles([]);
      setSelectedFileIds([]);
      setBaseline({ content: draftContent ?? "", fileIds: [], fileSig: [] });
      prevFilesDigestRef.current = JSON.stringify({ ids: [], sig: [] });
      return;
    }

    const mapped = mapServerFilesToUploadList(serverFiles);
    setSelectedFiles(mapped);
    const ids = mapped.map(f => f.file_id!).filter(Boolean);
    setSelectedFileIds(ids);

    const initialSig = buildFileSig(mapped);
    setBaseline({
      content: draftContent ?? "",
      fileIds: ids,
      fileSig: initialSig,
    });
    prevFilesDigestRef.current = JSON.stringify({
      ids: ids.slice().sort((a, b) => a - b),
      sig: initialSig,
    });
  }, [sessionKey]);

  const onSelectUserGuarded = (uid: number) => {
    tryLeave(() => handleSelectTab(uid));
  };

  const onStartAnswerGuarded = (
    ...args: Parameters<typeof handleStartAnswer>
  ) => {
    tryLeave(() => handleStartAnswer(...args));
  };

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
            onSelectUser={onSelectUserGuarded}
          />
        )}

        {/* 답변 내용 */}
        {isMyTabAndWriting ? (
          // 내 탭이 선택되고 답변 작성 중인 경우 에디터 표시
          <AnswerEditor
            key={sessionKey} // 세션 전환 시 에디터 강제 재마운트
            mode={isEditMode ? "edit" : "create"}
            initialContent={draftContent}
            onContentChange={setDraftContent}
            onSubmit={async (content, fileIds) => {
              await runWithBypass(async () => {
                await onEditorSubmit(content, fileIds);
                setClean(); // 제출 성공 시 현재를 기준선으로
              });
            }}
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
            onStartEdit={onStartAnswerGuarded}
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

      {/* Answer 전용 이탈 모달 */}
      <InquiryLeaveModal {...leaveModalForAnswer} />
    </div>
  );
};

export default AnswerSection;
