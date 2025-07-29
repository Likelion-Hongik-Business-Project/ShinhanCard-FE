import { USERS } from "@/mocks/usersMock";

import AssigneeSelector from "./AssigneeSelector";
import FileUploadBox from "./FileUploadBox";
import InquiryEditor from "./InquiryEditor";

interface Props {
  onDropdownStateChange: (isOpen: boolean) => void;
}

const InquiryForm = ({ onDropdownStateChange }: Props) => {
  return (
    <section className="flex flex-col gap-10 p-16 bg-white rounded-b-[15px]">
      <InquiryEditor />
      <div className="w-full h-[1px] bg-gray-10" />
      <FileUploadBox />
      <div className="w-full h-[1px] bg-gray-10" />
      <AssigneeSelector
        onDropdownStateChange={onDropdownStateChange}
        allUsers={USERS}
      />
    </section>
  );
};

export default InquiryForm;
