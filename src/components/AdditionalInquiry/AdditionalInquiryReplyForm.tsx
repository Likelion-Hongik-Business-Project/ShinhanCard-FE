import { ChangeEvent, useState } from "react";

import { Pen } from "@/assets/svgs/AdditionalInquiry";

export type Props = {
  parenWriter: string; // 부모 글쓴이 이름
  onClose: () => void;
};

const AdditionalInquiryReplyForm = ({ parenWriter, onClose }: Props) => {
  const [content, setContent] = useState("");
  const [hidePrefix, setHidePrefix] = useState(false);

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
    <div className="w-full rounded-[15px] p-8 border-3 border-main bg-white flex gap-8">
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative flex">
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

      {/* 완료 버튼 */}
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

export default AdditionalInquiryReplyForm;
