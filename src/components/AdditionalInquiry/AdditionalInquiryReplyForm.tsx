import { ChangeEvent, useEffect, useRef, useState } from "react";

import Pencil from "@/assets/svgs/common/pencil.svg";
import { useCommentApi } from "@/hooks/comment/commentApi";
import { TaggedUser } from "@/types/InquiryResponse";

import Button from "../common/Button";

export type Props = {
  taggedUser: TaggedUser;
  followUpId: number;
  onClose: () => void;
  commentId?: number;
  initialContent?: string;
};

const AdditionalInquiryReplyForm = ({
  taggedUser,
  followUpId,
  onClose,
  commentId,
  initialContent = "",
}: Props) => {
  const { postCommentsMutation, putCommentsMutation } =
    useCommentApi(followUpId);
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const prefix = taggedUser.username + " ";

  const isCompleteEnabled = content.trim().length > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [initialContent, prefix]);

  const handleComplete = () => {
    if (!isCompleteEnabled) return;
    const trimmed = content.trim();
    if (commentId) {
      putCommentsMutation.mutate(
        {
          commentId,
          data: { taggedUserId: taggedUser.user_id, content: trimmed },
        },
        {
          onSuccess: () => onClose(),
          // onError: 에러로직,
        }
      );
    } else {
      postCommentsMutation.mutate(
        { taggedUserId: taggedUser.user_id, content: trimmed },
        {
          onSuccess: () => onClose(),
          // onError: 에러로직,
        }
      );
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

  return (
    <div className="w-full rounded-[15px] p-8 border-3 border-main bg-white flex gap-8">
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative flex">
          <span className="absolute text-body2 text-main bg-white">
            {prefix}
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
