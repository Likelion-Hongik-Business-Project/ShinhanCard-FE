import { ChangeEvent, useEffect, useRef, useState } from "react";

import Pencil from "@/assets/svgs/common/pencil.svg";
import { useCommentApi } from "@/hooks/comment/commentApi";
import { TaggedUser } from "@/types/inquiryTypes";

import Button from "../common/Button";

export type Props = {
  taggedUser: TaggedUser;
  followUpId: number;
  onClose: () => void;
  commentId?: number;
  initialContent?: string;
};

const FollowupCommentForm = ({
  taggedUser,
  followUpId,
  onClose,
  commentId,
  initialContent = "",
}: Props) => {
  const { postCommentsMutation, putCommentsMutation } =
    useCommentApi(followUpId);
  const isMutating =
    postCommentsMutation.isPending || putCommentsMutation.isPending;
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isCompleteEnabled = content.trim().length > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [initialContent]);

  const handleComplete = () => {
    if (!isCompleteEnabled || isMutating) return;
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
    setContent(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className="w-full rounded-[15px] p-8 border-3 border-main bg-white flex gap-8">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <span className="text-body2-b text-state-progress-02">
            {taggedUser.username}
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
        buttonType={isCompleteEnabled && !isMutating ? "blue" : "done"}
        disabled={!isCompleteEnabled || isMutating}
        onClick={handleComplete}
        className={isCompleteEnabled && !isMutating ? "border-main border" : ""}
      >
        <Pencil className="w-4 h-4" />
        <span>완료</span>
      </Button>
    </div>
  );
};

export default FollowupCommentForm;
