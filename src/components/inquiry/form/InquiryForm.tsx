import { useTeamApi } from "@/hooks/team/useTeamApi";

import AssigneeSelector from "./AssigneeSelector";
import FileUploadBox from "./FileUploadBox";
import InquiryEditor from "./InquiryEditor";

interface Props {
  teamId: number;
  title: string;
  content: string;
  assigneeIds: number[];
  referenceIds: number[];
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
  setAssigneeIds: (ids: number[]) => void;
  setReferenceIds: (ids: number[]) => void;
  setFileIds: React.Dispatch<React.SetStateAction<number[]>>;
  onDropdownStateChange: (isOpen: boolean) => void;
}

const InquiryForm = ({
  teamId,
  title,
  content,
  assigneeIds,
  referenceIds,
  setTitle,
  setContent,
  setAssigneeIds,
  setReferenceIds,
  setFileIds,
  onDropdownStateChange,
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
      <FileUploadBox teamId={teamId} setFileIds={setFileIds} />
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
