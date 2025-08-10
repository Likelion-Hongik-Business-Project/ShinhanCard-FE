import { useState } from "react";

import { UploadFile } from "@/types/file/file.type";

export const useInquiryFormState = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<number[]>([]);
  const [referenceIds, setReferenceIds] = useState<number[]>([]);
  const [fileIds, setFileIds] = useState<number[]>([]);
  const [files, setFiles] = useState<UploadFile[]>([]);

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
    files,
    setFiles,
  };
};
