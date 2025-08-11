import { useEffect, useRef } from "react";

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

const InquiryEditor = ({ title, setTitle, content, setContent }: Props) => {
  const { editorRef, fileInputRef, activeSet, execCommand, handleFileChange } =
    useEditor();
  const uploadImage = useEditorImageUpload();

  // 프로그램적 세팅 중인지 구분하는 플래그
  const applyingRef = useRef(false);

  // content 변경 시 에디터에 반영
  useEffect(() => {
    const editor = editorRef.current?.getInstance();
    if (!editor) return;

    const current = editor.getMarkdown?.() ?? "";
    if (current === (content || "")) return;

    applyingRef.current = true;
    requestAnimationFrame(() => {
      // 필요하면 모드 전환
      editor.changeMode?.("wysiwyg", true);
      editor.setMarkdown(content || "");
      applyingRef.current = false;
    });
  }, [content, editorRef]);

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
              const editor = editorRef.current?.getInstance();
              editor?.exec("addImage", {
                imageUrl,
                altText: blob instanceof File ? blob.name : "image",
              });
              return false;
            },
          }}
          initialValue={content || ""}
          placeholder="본문의 내용을 입력하세요"
          language="ko"
          height="auto"
          initialEditType="wysiwyg"
          hideModeSwitch={true}
          previewStyle="tab"
          toolbarItems={[]}
          onChange={() => {
            if (applyingRef.current) return; // 프로그램적 세팅 중엔 무시
            const editor = editorRef.current?.getInstance();
            if (editor) setContent(editor.getMarkdown() || "");
          }}
        />
      </div>
    </div>
  );
};

export default InquiryEditor;
