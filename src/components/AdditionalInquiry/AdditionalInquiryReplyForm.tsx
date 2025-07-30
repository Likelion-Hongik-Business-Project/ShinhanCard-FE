import { ChangeEvent, useRef, useState } from "react";

import { Pencil } from "@/assets/svgs/commons";

import Button from "../common/Button";

export type Props = {
  parenWriter: string; // 부모 글쓴이 이름
  onClose: () => void;
};

const AdditionalInquiryReplyForm = ({ parenWriter, onClose }: Props) => {
  const [content, setContent] = useState("");
  const [hidePrefix, setHidePrefix] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isCompleteEnabled = content.trim().length > 0;

  const prefix = parenWriter + " ";

  const handleComplete = () => {
    if (isCompleteEnabled) {
      // onSubmit(content.trim());
      onClose();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    setContent(val.slice(prefix.length));

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setHidePrefix(e.currentTarget.scrollTop > 0);
  };

  return (
    <div className="w-full rounded-[15px] p-8 border-3 border-main bg-white flex gap-8">
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative flex">
          {!hidePrefix && (
            <span className="absolute text-body2-b text-state-progress-02">
              {prefix}
            </span>
          )}
          <textarea
            ref={textareaRef}
            className="
              flex-1
              w-full 
              focus:outline-none   
              resize-none
              text-body2
            "
            placeholder=""
            onScroll={handleScroll}
            value={prefix + content}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button
        type="button"
        buttonType={isCompleteEnabled ? "blue" : "done"}
        disabled={!isCompleteEnabled}
        onClick={handleComplete}
        // 활성 상태일 때만 테두리 색 덮어쓰기
        className={isCompleteEnabled ? "border-main border" : ""}
      >
        <Pencil className="w-4 h-4" />
        <span>완료</span>
      </Button>
    </div>
  );
};

export default AdditionalInquiryReplyForm;
