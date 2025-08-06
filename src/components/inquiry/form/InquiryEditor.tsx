import { useEffect, useState } from "react";

import { useEditorImageUpload } from "@/hooks/inquiry/useEditorImageUpload";
import { useEditor } from "@/hooks/useEditor";

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

const InquiryEditor = ({ title, setTitle, setContent, content }: Props) => {
  const { editorRef, fileInputRef, activeSet, execCommand, handleFileChange } =
    useEditor();
  const [isMounted, setIsMounted] = useState(false);
  const uploadImage = useEditorImageUpload();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ content 상태 변경 시 에디터에 반영
  useEffect(() => {
    if (!isMounted) return;
    const editorInstance = editorRef.current?.getInstance();
    editorInstance?.setMarkdown(content || "");
  }, [content, isMounted, editorRef]);

  // ✅ 에디터 입력 감지
  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    const observer = () => {
      const content = editorInstance?.getMarkdown() || "";
      setContent(content);
    };

    const el = editorRef.current?.getRootElement();
    el?.addEventListener("input", observer);
    return () => {
      el?.removeEventListener("input", observer);
    };
  }, [editorRef, setContent]);

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

      <Editor
        ref={editorRef}
        hooks={{
          addImageBlobHook: async (blob, callback) => {
            const imageUrl = await uploadImage(blob);
            callback(imageUrl, "image");
            return false;
          },
        }}
        initialValue=""
        placeholder="본문의 내용을 입력하세요"
        language="ko"
        height="auto"
        initialEditType="wysiwyg"
        hideModeSwitch={true}
        previewStyle="tab"
        toolbarItems={[]}
      />
    </div>
  );
};

export default InquiryEditor;
