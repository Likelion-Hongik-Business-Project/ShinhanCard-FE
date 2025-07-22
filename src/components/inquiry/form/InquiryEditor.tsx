import { useEffect, useState } from "react";

import { useEditor } from "@/hooks/useEditor";

import EditorToolbar from "./EditorToolbar";

import "@/styles/editor.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

const InquiryEditor = () => {
  const { editorRef, fileInputRef, activeSet, execCommand, handleFileChange } =
    useEditor();
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    editorInstance?.setMarkdown("");
  }, [editorRef]);

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
        initialValue=""
        placeholder="본문의 내용을 입력하세요"
        language="ko"
        initialEditType="wysiwyg"
        hideModeSwitch={true}
        previewStyle="tab"
        toolbarItems={[]}
      />
    </div>
  );
};

export default InquiryEditor;
