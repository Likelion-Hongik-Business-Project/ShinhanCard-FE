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

const InquiryEditor = ({ title, setTitle, content }: Props) => {
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
      editorInstance.setMarkdown(""); // 전체 초기화
      editorInstance.changeMode("wysiwyg", true);

      lines.forEach(line => {
        let remaining = line;
        let match: RegExpExecArray | null;

        while ((match = imageRegex.exec(remaining))) {
          const [fullMatch, alt, url] = match;
          const prefix = remaining.slice(0, match.index);
          if (prefix) {
            editorInstance.insertText(prefix); // 텍스트 먼저 삽입
          }

          editorInstance.exec("addImage", {
            imageUrl: url,
            altText: alt || "image",
          });

          // 다음 루프를 위해 이미지 마크다운 이후 텍스트만 남김
          remaining = remaining.slice(match.index + fullMatch.length);
          imageRegex.lastIndex = 0; // 내부 문자열 변경되었으니 리셋
        }

        // 남은 텍스트 삽입
        if (remaining.trim()) {
          editorInstance.insertText(remaining);
        }

        editorInstance.insertText("\n"); // 줄바꿈
      });
    });
  }, [content]);

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
        />
      </div>
    </div>
  );
};

export default InquiryEditor;
