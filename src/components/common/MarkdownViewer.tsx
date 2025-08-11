"use client";

import { useMemo } from "react";

import "@/styles/markdownViewer.css";
import MarkdownPreview from "@uiw/react-markdown-preview";

interface Props {
  content: string;
}

const sanitizeUrl = (raw: string) => {
  let s = (raw || "").trim();

  if (s.startsWith("<") && s.endsWith(">")) s = s.slice(1, -1);

  try {
    s = decodeURI(s);
  } catch (e) {
    console.warn("Invalid URI, skipping decode:", e);
  }
  s = encodeURI(s);
  s = s.replace(
    /[()'"<>]/g,
    ch => "%" + ch.charCodeAt(0).toString(16).toUpperCase()
  );
  return s;
};

const transformImagesSafely = (md: string) => {
  const parts = (md ?? "").split(/(```[\s\S]*?```)/g);
  return parts
    .map(part => {
      if (part.startsWith("```")) return part;

      return part.replace(
        /!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^)\s]+))(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g,
        (_, alt: string, urlA?: string, urlB?: string) => {
          const url = sanitizeUrl(urlA || urlB || "");
          return `![${alt}](${url})`;
        }
      );
    })
    .join("");
};

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
