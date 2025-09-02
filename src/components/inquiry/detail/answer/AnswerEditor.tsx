import { useCallback, useEffect, useRef } from "react";

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

  const keyRef = useRef<string>(
    `answer:${mode}:${Date.now()}:${Math.random().toString(36).slice(2)}`
  );
  const answerKey = keyRef.current;

  const baselineRef = useRef<string>("");

  // 에디터 준비될 때까지 초기화 (RAF)
  useEffect(() => {
    let raf = 0;
    let initialized = false;

    const init = () => {
      const instance = editorRef.current?.getInstance?.();
      if (!instance) {
        raf = requestAnimationFrame(init);
        return;
      }

      const prepared = normalizeContent(initialContent ?? "");
      if (instance.getMarkdown() !== prepared) {
        instance.setMarkdown(prepared);
      }

      baselineRef.current = prepared;

      const isDirty = (instance.getMarkdown() ?? "") !== baselineRef.current;
      const evt = new CustomEvent("followup:dirty", {
        detail: { dirty: isDirty, reason: "open", key: answerKey },
      });
      window.dispatchEvent(evt);

      initialized = true;
    };

    init();

    return () => {
      if (!initialized) cancelAnimationFrame(raf);
      window.dispatchEvent(
        new CustomEvent("followup:dirty", {
          detail: { dirty: false, reason: "unmount", key: answerKey },
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  // 변경 즉시 더티 방송 (+ 같은 틱 경합 보강)
  const handleChange = useCallback(() => {
    const md = editorRef.current?.getInstance?.().getMarkdown?.() ?? "";
    onContentChange(md);

    const isDirty = md !== baselineRef.current;
    const evt = new CustomEvent("followup:dirty", {
      detail: { dirty: isDirty, reason: "change", key: answerKey },
    });
    window.dispatchEvent(evt);
    queueMicrotask(() => window.dispatchEvent(evt));
  }, [editorRef, onContentChange, answerKey]);

  const handleSubmit = async () => {
    const raw = editorRef.current?.getInstance?.().getMarkdown?.() || "";
    const normalized = normalizeContent(raw);
    await onSubmit(normalized, fileIds);
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
