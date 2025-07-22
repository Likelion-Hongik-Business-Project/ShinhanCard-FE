import { useRef, useState } from "react";

import { isHeadingCommand, isInlineCommand } from "@/utils/commandUtils";
import { EditorCommand } from "@/types/toolbar";

import { Editor } from "@toast-ui/react-editor";

export const useEditor = () => {
  const editorRef = useRef<Editor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSet, setActiveSet] = useState<Set<string>>(new Set());

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
    const editorInstance = editorRef.current?.getInstance();
    editorInstance?.insertText(`![이미지 설명](${imageUrl})`);
    e.target.value = "";
  };

  return {
    editorRef,
    fileInputRef,
    activeSet,
    execCommand,
    handleFileChange,
  };
};
