import { useCallback, useEffect } from "react";

import Pencil from "@/assets/svgs/inquiry/pencil.svg";
import Button from "@/components/common/Button";
import EditorToolbar from "@/components/inquiry/form/EditorToolbar";
import FileUploadBox from "@/components/inquiry/form/FileUploadBox";
import { useEditor } from "@/hooks/inquiry/useEditor";
import { normalizeContent } from "@/utils/editorImageUtils";
import { AnswerEditorProps } from "@/types/inquiryTypes";

import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

const AnswerEditor = ({
  mode,
  initialContent,
  onContentChange,
  onSubmit,
  fileIds,
  files,
  setFileIds,
  setFiles,
}: AnswerEditorProps) => {
  const { editorRef, fileInputRef, activeSet, execCommand, handleFileChange } =
    useEditor();

  // 초기 주입: 정규화 후 세팅
  useEffect(() => {
    const instance = editorRef.current?.getInstance();
    if (!instance) return;
    const prepared = normalizeContent(initialContent ?? "");
    if (instance.getMarkdown() !== prepared) {
      instance.setMarkdown(prepared);
    }
  }, [initialContent, editorRef]);

  // 변경 감지: 래퍼 prop 사용
  const handleChange = useCallback(() => {
    const md = editorRef.current?.getInstance().getMarkdown() ?? "";
    onContentChange(md);
  }, [editorRef, onContentChange]);

  const handleSubmit = () => {
    const raw = editorRef.current?.getInstance().getMarkdown() || "";
    onSubmit(normalizeContent(raw), fileIds);
  };

  const isEdit = mode === "edit";
  const buttonLabel = isEdit ? "답변 수정하기" : "답변 등록하기";

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2 px-4 py-8">
        <EditorToolbar
          activeSet={activeSet}
          execCommand={execCommand}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
        <div className="min-h-[230px]">
          <Editor
            ref={editorRef}
            initialValue={normalizeContent(initialContent ?? "")}
            placeholder="답변 내용을 입력하세요."
            previewStyle="vertical"
            height="auto"
            initialEditType="wysiwyg"
            hideModeSwitch={true}
            toolbarItems={[]}
            onChange={handleChange}
            language="ko-KR"
          />
        </div>
      </div>
      <FileUploadBox
        fileIds={fileIds}
        files={files}
        setFileIds={setFileIds}
        setFiles={setFiles}
      />
      <div className="flex justify-end gap-4">
        <Button buttonType="blue" onClick={handleSubmit}>
          <Pencil />
          <span className="text-heading3 text-white">{buttonLabel}</span>
        </Button>
      </div>
    </div>
  );
};

export default AnswerEditor;
