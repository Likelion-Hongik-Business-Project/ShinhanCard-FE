import { useEffect, useRef, useState } from "react";

import { toolbarButtons } from "@/constants/toolbarButtons";
import { EditorCommand } from "@/types/toolbar";

import "@/styles/editor.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as ReactEditor } from "@toast-ui/react-editor";

const InquiryEditor = () => {
  const editorRef = useRef<ReactEditor>(null);
  const [active, setActive] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");

  const isToolbarItem = (
    item: (typeof toolbarButtons)[number]
  ): item is Exclude<typeof item, "divider"> => {
    return typeof item !== "string";
  };

  const execCommand = (params: EditorCommand) => {
    const editorInstance = editorRef.current?.getInstance();

    if (!editorInstance) return;

    if (params.command === "heading") {
      if (active === `h${params.payload.level}`) {
        editorInstance.exec("paragraph");
        setActive(null);
      } else {
        editorInstance.exec("heading", params.payload);
        setActive(`h${params.payload.level}`);
      }
    } else {
      editorInstance.exec(params.command);
      setActive(params.command);
    }
  };

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    editorInstance?.setHTML("");
    editorInstance?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={30}
        placeholder="제목은 30자 이내로 입력해주세요."
        className="w-full  text-heading2-sb text-gray-90 placeholder-gray-30 focus:outline-none"
      />
      <div className="w-full h-[1px] bg-gray-10" />

      <div className="flex p-2 gap-3 items-center">
        {toolbarButtons.map((item, idx) => {
          if (!isToolbarItem(item)) {
            return (
              <div key={`divider-${idx}`} className="w-[1px] bg-gray-200 h-4" />
            );
          }

          return (
            <button
              key={item.key}
              onClick={() =>
                item.command === "heading"
                  ? execCommand({
                      command: "heading",
                      payload: { level: item.level! },
                    })
                  : execCommand({ command: item.command })
              }
              className={`cursor-pointer ${
                active === item.key ? "text-gray-80" : "text-gray-50"
              } `}
            >
              {item.icon()}
            </button>
          );
        })}
      </div>

      <ReactEditor
        ref={editorRef}
        initialValue=""
        placeholder="본문의 내용을 입력하세요"
        previewStyle="vertical"
        initialEditType="wysiwyg"
        hideModeSwitch={true}
        toolbarItems={[]}
      />
    </div>
  );
};

export default InquiryEditor;
