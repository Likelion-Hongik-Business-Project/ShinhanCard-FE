import { ChangeEvent, useRef, useState } from "react";

import { Pencil } from "@/assets/svgs/commons";

import Button from "../common/Button";

export type Props = {
  recipient: string; // 수신자
  onClose: () => void;
};

const AdditionalInquiryReplyForm = ({ recipient, onClose }: Props) => {
  const [content, setContent] = useState("");
  const [hidePrefix, setHidePrefix] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isCompleteEnabled = content.trim().length > 0;

  const prefix = recipient + " ";

  const handleComplete = () => {
    if (isCompleteEnabled) {
      // todo: 댓글 추가 or 수정: onSubmit(content.trim(), recipient);
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
        className={isCompleteEnabled ? "border-main border" : ""}
      >
        <Pencil className="w-4 h-4" />
        <span>완료</span>
      </Button>
    </div>
  );
};

export default AdditionalInquiryReplyForm;
