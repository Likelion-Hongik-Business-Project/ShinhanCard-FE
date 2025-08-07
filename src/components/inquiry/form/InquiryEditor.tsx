import { useEffect } from "react";

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

  // content 상태 변경 시 반영
  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;

    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;

    // 줄 단위로 split
    const lines = content.split("\n");

    requestAnimationFrame(() => {
      editorInstance.setMarkdown(content || "");
      editorInstance.changeMode("wysiwyg", true);

      lines.forEach((line, index) => {
        let remaining = line;
        let match: RegExpExecArray | null;

        while ((match = imageRegex.exec(remaining))) {
          const [fullMatch, alt, url] = match;
          const prefix = remaining.slice(0, match.index);
          if (prefix) {
            editorInstance.insertText(prefix);
          }

          editorInstance.exec("addImage", {
            imageUrl: url,
            altText: alt || "image",
          });

          remaining = remaining.slice(match.index + fullMatch.length);
          imageRegex.lastIndex = 0;
        }

        if (remaining.trim()) {
          editorInstance.insertText(remaining);
        }

        if (index !== 0) {
          editorInstance.insertText("\n");
        }
      });
    });
  }, []);

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
              const editorInstance = editorRef.current?.getInstance();
              editorInstance?.exec("addImage", {
                imageUrl,
                altText: blob instanceof File ? blob.name : "image",
              });

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
          onChange={() => {
            const editorInstance = editorRef.current?.getInstance();
            if (editorInstance) {
              const current = editorInstance.getMarkdown();
              setContent(current);
            }
          }}
        />
      </div>
    </div>
  );
};

export default InquiryEditor;
