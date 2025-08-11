import { useEffect, useMemo, useRef } from "react";

import { useEditorImageUpload } from "@/hooks/inquiry/create/useEditorImageUpload";
import { useEditor } from "@/hooks/inquiry/useEditor";

import EditorToolbar from "./EditorToolbar";

import "@/styles/editor.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

interface Props {
  title: string;
  content: string;
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
}

const encodeMarkdownImageUrls = (md: string) =>
  (md ?? "").replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) => {
    try {
      return `![${alt}](${encodeURI(decodeURI(url))})`;
    } catch {
      return `![${alt}](${encodeURI(url)})`;
    }
  });

const InquiryEditor = ({ title, setTitle, content, setContent }: Props) => {
  const { editorRef, fileInputRef, activeSet, execCommand, handleFileChange } =
    useEditor();
  const uploadImage = useEditorImageUpload();

  // 프로그램적 세팅 중 플래그
  const applyingRef = useRef(false);

  const fixedContent = useMemo(
    () => encodeMarkdownImageUrls(content),
    [content]
  );

  // content 변경 시 에디터에 반영 (WYSIWYG로 이미지 즉시 렌더)
  useEffect(() => {
    const inst = editorRef.current?.getInstance();
    if (!inst) return;

    const current = inst.getMarkdown?.() ?? "";
    if (current === (fixedContent || "")) return;

    applyingRef.current = true;

    // WYSIWYG 모드로 전환 후 setMarkdown
    inst.changeMode?.("wysiwyg", true);
    inst.setMarkdown(fixedContent || "");

    // 일부 버전/상황에서 파서가 안 도는 경우가 있어 모드 토글로 강제 리렌더
    requestAnimationFrame(() => {
      inst.changeMode?.("markdown", true);
      inst.changeMode?.("wysiwyg", true);
      applyingRef.current = false;
    });
  }, [fixedContent, editorRef]);

  return (
    <div className="flex flex-col gap-6">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={30}
        placeholder="제목은 30자 이내로 입력해주세요."
        className="w-full text-heading2-sb text-gray-90 placeholder-gray-30 focus:outline-none"
      />

      <div className="w-full h-[1px] bg-gray-10" />

      <div className="flex p-2 gap-3 items-center">
        <EditorToolbar
          activeSet={activeSet}
          execCommand={execCommand}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
      </div>

      <div className="min-h-[230px]">
        <Editor
          ref={editorRef}
          hooks={{
            addImageBlobHook: async blob => {
              const imageUrl = await uploadImage(blob);
              const inst = editorRef.current?.getInstance();
              inst?.exec("addImage", {
                imageUrl,
                altText: blob instanceof File ? blob.name : "image",
              });
              return false;
            },
          }}
          initialValue={fixedContent || ""}
          placeholder="본문의 내용을 입력하세요"
          language="ko"
          height="auto"
          initialEditType="wysiwyg"
          hideModeSwitch={true}
          previewStyle="tab"
          toolbarItems={[]}
          onChange={() => {
            if (applyingRef.current) return;
            const inst = editorRef.current?.getInstance();
            if (inst) setContent(inst.getMarkdown() || "");
          }}
          usageStatistics={false}
        />
      </div>
    </div>
  );
};

export default InquiryEditor;
