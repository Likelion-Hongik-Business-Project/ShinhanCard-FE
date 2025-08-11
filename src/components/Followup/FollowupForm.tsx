import { ChangeEvent, useEffect, useRef, useState } from "react";

import Pencil from "@/assets/svgs/common/pencil.svg";
import { FilledUnion, Union } from "@/assets/svgs/followup";
import { useFollowupApi } from "@/hooks/followup/followupApi";
import { Assignee } from "@/types/InquiryResponse";

import Button from "../common/Button";

type Props = {
  inquiryId: number;
  assignees: Assignee[];
  // 수정시
  followupId?: number;
  initialContent?: string;
  initialAssigneeId?: number;
  onClose: () => void;
};

const FollowupForm = ({
  inquiryId,
  assignees,
  followupId,
  initialContent,
  initialAssigneeId,
  onClose,
}: Props) => {
  const { postFollowupsMutation, putFollowupsMutation } =
    useFollowupApi(inquiryId);
  const [selectedId, setSelectedId] = useState<number | null>(
    initialAssigneeId ?? null
  );
  const [content, setContent] = useState(initialContent ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedName = assignees.find(a => a.user_id === selectedId)?.user_name;

  const isCompleteEnabled = selectedId !== null && content.trim().length > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [initialContent, selectedId]);

  const handleToggleAssignee = (id: number) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  const handleComplete = () => {
    if (!isCompleteEnabled) return;
    const payload = { content: content.trim(), assigneeId: selectedId! };
    if (followupId != null) {
      putFollowupsMutation.mutate(
        { followupId, data: payload },
        {
          onSuccess: () => onClose(),
          onError: error => console.error("Failed to update followup", error),
        }
      );
    } else {
      postFollowupsMutation.mutate(payload, {
        onSuccess: () => onClose(),
        onError: error => console.error("Failed to post followup", error),
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
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
                {a.user_name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="text-body2-b text-state-progress-02">
            {selectedName}
          </span>
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
            value={content}
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

export default FollowupForm;
