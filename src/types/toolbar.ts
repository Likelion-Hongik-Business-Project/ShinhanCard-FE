import { ReactElement } from "react";

export type ToolbarButton =
  | {
      command: "heading";
      level: 1 | 2 | 3 | 4;
      icon: () => ReactElement;
      key: string;
    }
  | {
      command: "bold" | "italic" | "strike" | "quote" | "link" | "image";
      icon: () => ReactElement;
      key: string;
    }
  | "divider";

export type EditorCommand =
  | { command: "bold" | "italic" | "strike" | "quote" | "link" | "image" }
  | { command: "heading"; payload: { level: number } };
