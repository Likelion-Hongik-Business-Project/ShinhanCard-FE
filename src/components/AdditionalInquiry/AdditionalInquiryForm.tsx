import { ChangeEvent, useRef, useState } from "react";

import { FilledUnion, Union } from "@/assets/svgs/AdditionalInquiry";
import Pencil from "@/assets/svgs/common/pencil.svg";
import { Assignee } from "@/types/InquiryResponse";

import Button from "../common/Button";

type Props = {
  assignees: Assignee[];
  onClose: () => void;
};

const AdditionalInquiryForm = ({ assignees, onClose }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [hidePrefix, setHidePrefix] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedName = assignees.find(a => a.user_id === selectedId)?.name;

  const prefix = selectedName ? selectedName + " " : "";

  const isCompleteEnabled = selectedId !== null && content.trim().length > 0;

  const handleToggleAssignee = (id: number) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  const handleComplete = () => {
    if (isCompleteEnabled) {
      // todo: 추가 문의 제출 or 수정 : onSubmit(content.trim(), selectedId);
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
    <div className="w-full rounded-[15px] p-8 border-3 border-main flex gap-8 ">
      <div className="flex-1 min-h-[150px] flex flex-col gap-8">
        <div className="flex gap-5 items-center">
          <span className="text-body2 text-gray-50">문의대상</span>
          <div className="flex gap-4">
            {assignees.map(a => (
              <button
                key={a.user_id}
                type="button"
                onClick={() => handleToggleAssignee(a.user_id)}
                className="flex gap-2 items-center"
              >
                {a.user_id === selectedId ? <FilledUnion /> : <Union />}
                {a.name}
              </button>
            ))}
          </div>
        </div>
        <div className="relative flex bg-white">
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

export default AdditionalInquiryForm;
