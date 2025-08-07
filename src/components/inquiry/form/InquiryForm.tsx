import { useTeamApi } from "@/hooks/team/useTeamApi";
import { UploadFile } from "@/types/file/file.type";

import AssigneeSelector from "./AssigneeSelector";
import FileUploadBox from "./FileUploadBox";
import InquiryEditor from "./InquiryEditor";

interface Props {
  teamId: number;
  title: string;
  content: string;
  assigneeIds: number[];
  referenceIds: number[];
  fileIds: number[];
  files: UploadFile[];
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
  setAssigneeIds: (ids: number[]) => void;
  setReferenceIds: (ids: number[]) => void;
  setFileIds: React.Dispatch<React.SetStateAction<number[]>>;
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  onDropdownStateChange: (isOpen: boolean) => void;
}

const InquiryForm = ({
  teamId,
  title,
  content,
  assigneeIds,
  referenceIds,
  fileIds,
  setTitle,
  setContent,
  setAssigneeIds,
  setReferenceIds,
  setFileIds,
  onDropdownStateChange,
  files,
  setFiles,
}: Props) => {
  const { useUsersQuery } = useTeamApi();
  const { data: users = [] } = useUsersQuery();

  return (
    <section className="flex flex-col gap-10 p-16 bg-white rounded-b-[15px]">
      <InquiryEditor
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
      />
      <div className="w-full h-[1px] bg-gray-10" />
      <FileUploadBox
        teamId={teamId}
        fileIds={fileIds}
        files={files}
        setFileIds={setFileIds}
        setFiles={setFiles}
      />
      <div className="w-full h-[1px] bg-gray-10" />
      <AssigneeSelector
        assigneeIds={assigneeIds}
        referenceIds={referenceIds}
        setAssigneeIds={setAssigneeIds}
        setReferenceIds={setReferenceIds}
        onDropdownStateChange={onDropdownStateChange}
        allUsers={users}
      />
    </section>
  );
};

export default InquiryForm;
