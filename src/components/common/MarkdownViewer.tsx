"use client";

import { useMemo } from "react";

import { transformImagesSafely } from "@/utils/markdownImageUtils";

import "@/styles/markdownViewer.css";
import MarkdownPreview from "@uiw/react-markdown-preview";

interface Props {
  content: string;
}

const MarkdownViewer = ({ content }: Props) => {
  const fixedContent = useMemo(
    () => transformImagesSafely(content || ""),
    [content]
  );

  return (
    <div className="prose max-w-none markdown-custom">
      <MarkdownPreview
        source={fixedContent}
        className="!bg-transparent !p-0 !shadow-none"
        skipHtml={false}
      />
    </div>
  );
};

export default MarkdownViewer;
