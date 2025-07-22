import React, { RefObject } from "react";

import { toolbarButtons } from "@/constants/toolbarButtons";
import { isToolbarItem } from "@/utils/commandUtils";
import { EditorCommand } from "@/types/toolbar";

interface EditorToolbarProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  activeSet: Set<string>;
  execCommand: (command: EditorCommand) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditorToolbar = ({
  activeSet,
  execCommand,
  fileInputRef,
  handleFileChange,
}: EditorToolbarProps) => {
  return (
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
                execCommand({
                  command: item.command,
                } as Extract<EditorCommand, { command: typeof item.command }>);
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
  );
};

export default EditorToolbar;
