import AssigneeSelector from "./AssigneeSelector";
import FileUploadBox from "./FileUploadBox";
import InquiryEditor from "./InquiryEditor";

import { USERS } from "@/mocks/usersMock";
interface InquiryFormProps {
  group: string;
  division: string;
  team: string;
  onDropdownStateChange: (isOpen: boolean) => void;
}

const InquiryForm = ({
  group,
  division,
  team,
  onDropdownStateChange,
}: InquiryFormProps) => {
  const filteredUsers = USERS.filter(
    user =>
      user.group_name === group &&
      user.division_name === division &&
      user.team_name === team
  );

  return (
    <section className="flex flex-col gap-10 p-16 bg-white rounded-b-[15px]">
      <InquiryEditor />
      <div className="w-full h-[1px] bg-gray-10" />
      <FileUploadBox />
      <div className="w-full h-[1px] bg-gray-10" />
      <AssigneeSelector
        onDropdownStateChange={onDropdownStateChange}
        users={filteredUsers}
      />
    </section>
  );
};

export default InquiryForm;
