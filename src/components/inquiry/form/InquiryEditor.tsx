import { useEffect, useRef, useState } from "react";

import { toolbarButtons } from "@/constants/toolbarButtons";
import { EditorCommand } from "@/types/toolbar";

import "@/styles/editor.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

const InquiryEditor = () => {
  const editorRef = useRef<Editor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSet, setActiveSet] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState<string>("");

  const isToolbarItem = (
    item: (typeof toolbarButtons)[number]
  ): item is Exclude<typeof item, "divider"> => {
    return typeof item !== "string";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const editorInstance = editorRef.current?.getInstance();
    editorInstance?.insertText(`![이미지 설명](${imageUrl})`);

    e.target.value = "";
  };

  const isInlineCommand = (
    cmd: EditorCommand
  ): cmd is {
    command: "bold" | "italic" | "strike" | "link" | "image";
  } => {
    return cmd.command !== "heading" && cmd.command !== "quote";
  };

  const isHeadingCommand = (
    cmd: EditorCommand
  ): cmd is { command: "heading"; payload: { level: number } } => {
    return cmd.command === "heading";
  };

  const execCommand = (params: EditorCommand) => {
    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;

    const newSet = new Set(activeSet);

    if (isInlineCommand(params)) {
      const isActive = newSet.has(params.command);

      editorInstance.exec(params.command);

      if (isActive) {
        newSet.delete(params.command);
      } else {
        newSet.add(params.command);
      }
    } else if (params.command === "quote") {
      const isActive = newSet.has("quote");

      if (isActive) {
        editorInstance.exec("removeBlockQuote");
        newSet.delete("quote");
      } else {
        editorInstance.exec("blockQuote");
        newSet.add("quote");
      }
    } else if (isHeadingCommand(params)) {
      const current = `h${params.payload.level}`;
      const isActive = newSet.has(current);

      if (isActive) {
        editorInstance.exec("paragraph");
        ["h1", "h2", "h3", "h4"].forEach(h => newSet.delete(h));
      } else {
        editorInstance.exec("heading", params.payload);
        ["h1", "h2", "h3", "h4"].forEach(h => newSet.delete(h));
        newSet.add(current);
      }
    }

    setActiveSet(newSet);
  };

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      editorInstance.setMarkdown("");
    }
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
        {toolbarButtons.map((item, idx) => {
          if (!isToolbarItem(item)) {
            return (
              <div key={`divider-${idx}`} className="w-[1px] bg-gray-200 h-4" />
            );
          }

          const isActive =
            item.command === "heading" && item.level
              ? activeSet.has(`h${item.level}`)
              : activeSet.has(item.command);

          return (
            <button
              key={item.key}
              onClick={() => {
                if (item.command === "heading" && item.level) {
                  execCommand({
                    command: "heading",
                    payload: { level: item.level },
                  });
                } else {
                  execCommand({ command: item.command } as EditorCommand);
                }
              }}
              className={`cursor-pointer ${
                isActive ? "text-gray-80" : "text-gray-50"
              }`}
            >
              {item.icon()}
            </button>
          );
        })}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
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
