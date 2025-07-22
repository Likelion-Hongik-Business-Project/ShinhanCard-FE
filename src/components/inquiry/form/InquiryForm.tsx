import AssigneeSelector from "./AssigneeSelector";
import FileUploadBox from "./FileUploadBox";
import InquiryEditor from "./InquiryEditor";

import { USERS } from "@/mocks/usersMock";

interface InquiryFormProps {
  onDropdownStateChange: (isOpen: boolean) => void;
}

const InquiryForm = ({ onDropdownStateChange }: InquiryFormProps) => {
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
