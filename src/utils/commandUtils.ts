import { toolbarButtons } from "@/constants/toolbarButtons";
import { EditorCommand } from "@/types/inquiry/toolbar.type";

export const isToolbarItem = (
  item: (typeof toolbarButtons)[number]
): item is Exclude<typeof item, "divider"> => {
  return typeof item !== "string";
};

export const isInlineCommand = (
  cmd: EditorCommand
): cmd is {
  command: "bold" | "italic" | "strike" | "link" | "image";
} => {
  return cmd.command !== "heading" && cmd.command !== "quote";
};

export const isHeadingCommand = (
  cmd: EditorCommand
): cmd is { command: "heading"; payload: { level: number } } => {
  return cmd.command === "heading";
};
