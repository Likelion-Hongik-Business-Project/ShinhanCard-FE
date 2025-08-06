import { useState } from "react";

export const useInquiryFormState = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [referenceIds, setReferenceIds] = useState<number[]>([]);
  const [fileIds, setFileIds] = useState<number[]>([]);

  return {
    title,
    setTitle,
    content,
    setContent,
    assigneeId,
    setAssigneeId,
    referenceIds,
    setReferenceIds,
    fileIds,
    setFileIds,
  };
};
