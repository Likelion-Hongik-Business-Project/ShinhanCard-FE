import { ChangeEvent, useState } from "react";

import { FilledUnion, Pen, Union } from "@/assets/svgs/AdditionalInquiry";
import { Assignee } from "@/types/InquiryResponse";

type Props = {
  assignees: Assignee[];
  onClose: () => void;
};

const AdditionalInquiryForm = ({ assignees, onClose }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [hidePrefix, setHidePrefix] = useState(false);

  const selectedName = assignees.find(a => a.user_id === selectedId)?.name;

  const prefix = selectedName ? selectedName + " " : "";

  const isCompleteEnabled = selectedId !== null && content.trim().length > 0;

  const handleToggleAssignee = (id: number) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  const handleComplete = () => {
    if (isCompleteEnabled) {
      // const assignee = assignees.find(a => a.user_id === selectedId)!;
      // onSubmit(assignee, content.trim());
      onClose();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!val.startsWith(prefix)) {
      // prefix 뒤 본문만 잘라서 state에 저장
      setContent(val.slice(prefix.length));
    } else {
      setContent(val.slice(prefix.length));
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
        <div className="relative flex bg-white">
          {!hidePrefix && (
            <span className="absolute text-body2-b text-state-progress-02">
              {prefix}
            </span>
          )}
          <textarea
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

      <button
        type="button"
        disabled={!isCompleteEnabled}
        onClick={handleComplete}
        className={`h-16 px-6 rounded-[15px] flex items-center gap-4 border ${
          isCompleteEnabled
            ? "bg-main text-white border-main"
            : "bg-gray-20 text-gray-80 cursor-not-allowed"
        }`}
      >
        <Pen className="w-4 h-4" />
        <span className="text-heading3">완료</span>
      </button>
    </div>
  );
};

export default AdditionalInquiryForm;
