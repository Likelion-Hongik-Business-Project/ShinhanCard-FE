import { useEffect, useRef, useState } from "react";

import { isHeadingCommand, isInlineCommand } from "@/utils/commandUtils";
import { EditorCommand } from "@/types/inquiry/toolbar.type";

import { useEditorImageUpload } from "./create/useEditorImageUpload";

import { Editor as EditorCore } from "@toast-ui/editor";
import { Editor } from "@toast-ui/react-editor";

interface WysiwygEditor {
  view: {
    dom: HTMLElement;
  };
}

interface SafeEditor extends EditorCore {
  wwEditor: WysiwygEditor;

  on(event: "caretChange", handler: () => void): void;
  on(event: string, handler: (...args: unknown[]) => void): void;

  off(event: "caretChange", handler: () => void): void;
  off(event: string, handler?: (...args: unknown[]) => void): void;
}

export const useEditor = () => {
  const uploadImage = useEditorImageUpload();
  const editorRef = useRef<Editor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSet, setActiveSet] = useState<Set<string>>(new Set());

  const execCommand = (params: EditorCommand) => {
    const editorInstance =
      editorRef.current?.getInstance() as unknown as SafeEditor;

    if (!editorInstance) return;

    const newSet = new Set(activeSet);

    if (params.command === "image") {
      fileInputRef.current?.click();
      return;
    }

    if (isInlineCommand(params)) {
      const isActive = newSet.has(params.command);
      editorInstance.exec(params.command);
      if (isActive) {
        newSet.delete(params.command);
      } else {
        newSet.add(params.command);
      }
    } else if (params.command === "quote") {
      editorInstance.exec("blockQuote");
      newSet.add("quote");
    } else if (isHeadingCommand(params)) {
      const current = `h${params.payload.level}`;
      const isActive = newSet.has(current);

      if (isActive) {
        editorInstance.exec("heading", { level: 0 });
        ["h1", "h2", "h3", "h4"].forEach(h => newSet.delete(h));
      } else {
        editorInstance.exec("heading", params.payload);
        ["h1", "h2", "h3", "h4"].forEach(h => newSet.delete(h));
        newSet.add(current);
      }
    }

    setActiveSet(newSet);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const editorInstance =
        editorRef.current?.getInstance() as unknown as SafeEditor;

      // 이미지 업로드
      const imageUrl = await uploadImage(file);

      // WYSIWYG 모드로 강제 전환
      editorInstance.changeMode("wysiwyg", true);

      // 다음 프레임에서 이미지 삽입
      requestAnimationFrame(() => {
        editorInstance.exec("addImage", {
          imageUrl,
          altText: file.name,
        });
      });
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    } finally {
      e.target.value = "";
    }
  };

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance() as SafeEditor;
    if (!editorInstance) return;

    const handleCaretChange = () => {
      const root = editorInstance.wwEditor.view.dom;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      let node = range.startContainer as HTMLElement;

      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement!;
      }

      const newSet = new Set<string>();

      let blockNode: HTMLElement | null = node;
      while (blockNode && blockNode !== root) {
        if (blockNode.tagName === "BLOCKQUOTE") {
          newSet.add("quote");
          break;
        }
        blockNode = blockNode.parentElement!;
      }

      let inlineNode: HTMLElement | null = node;
      while (inlineNode && inlineNode !== root) {
        const tag = inlineNode.tagName;

        if (tag === "B" || tag === "STRONG") newSet.add("bold");
        if (tag === "I" || tag === "EM") newSet.add("italic");
        if (tag === "S" || tag === "DEL") newSet.add("strike");

        inlineNode = inlineNode.parentElement;
      }

      const headingTag = node.closest("H1, H2, H3, H4")?.tagName;
      if (headingTag) {
        newSet.add(headingTag.toLowerCase());
      }

      setActiveSet(newSet);
    };

    editorInstance.on("caretChange", handleCaretChange);

    return () => {
      editorInstance.off("caretChange", handleCaretChange);
    };
  }, []);

  return {
    editorRef,
    fileInputRef,
    activeSet,
    execCommand,
    handleFileChange,
  };
};
