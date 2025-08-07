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

const InquiryEditor = ({ title, setTitle, setContent, content }: Props) => {
  const { editorRef, fileInputRef, activeSet, execCommand, handleFileChange } =
    useEditor();

  const uploadImage = useEditorImageUpload();

  // content 상태 변경 시 반영
  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;

    const lines = content.split("\n");
    const imageRegex = /!\[.*?\]\((.*?)\)/;

    requestAnimationFrame(() => {
      editorInstance.setMarkdown("");
      editorInstance.changeMode("wysiwyg", true);

      lines.forEach(line => {
        const match = line.match(imageRegex);

        if (match) {
          const imageUrl = match[1];
          // 줄에 이미지 마크다운만 있는 경우: 해당 위치에 이미지 삽입
          if (line.trim() === match[0]) {
            editorInstance.insertText("\n"); // 줄바꿈
            editorInstance.exec("addImage", {
              imageUrl,
              altText: "image",
            });
          } else {
            // 이미지 외 텍스트도 있는 줄이면 텍스트 먼저 삽입
            const cleanedLine = line.replace(imageRegex, "");
            editorInstance.insertText(`${cleanedLine}\n`);
            editorInstance.exec("addImage", {
              imageUrl,
              altText: "image",
            });
          }
        } else {
          // 이미지 없는 일반 줄은 그대로 삽입
          editorInstance.insertText(`${line}\n`);
        }
      });
    });
  }, [content]);

  // editor 내용 변경될 때마다 setContent에 반영
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
