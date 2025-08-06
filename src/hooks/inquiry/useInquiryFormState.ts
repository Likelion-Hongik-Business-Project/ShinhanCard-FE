import { useState } from "react";

export const useInquiryFormState = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<number[]>([]);
  const [referenceIds, setReferenceIds] = useState<number[]>([]);
  const [fileIds, setFileIds] = useState<number[]>([]);

  return {
    title,
    setTitle,
    content,
    setContent,
    assigneeIds,
    setAssigneeIds,
    referenceIds,
    setReferenceIds,
    fileIds,
    setFileIds,
  };
};
