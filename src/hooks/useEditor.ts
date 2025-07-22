import { useEffect, useRef, useState } from "react";

import { isHeadingCommand, isInlineCommand } from "@/utils/commandUtils";
import { EditorCommand } from "@/types/toolbar";

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
  const editorRef = useRef<Editor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSet, setActiveSet] = useState<Set<string>>(new Set());

  const execCommand = (params: EditorCommand) => {
    const editorInstance = editorRef.current?.getInstance() as EditorCore;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const editorInstance = editorRef.current?.getInstance() as EditorCore;
    editorInstance.insertText(`![이미지 설명](${imageUrl})`);
    e.target.value = "";
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

      let isQuote = false;
      while (node && node !== root) {
        if (node.tagName === "BLOCKQUOTE") {
          isQuote = true;
          break;
        }
        node = node.parentElement!;
      }

      setActiveSet(prev => {
        const newSet = new Set(prev);
        if (!isQuote) {
          newSet.delete("quote");
        }
        return newSet;
      });
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
