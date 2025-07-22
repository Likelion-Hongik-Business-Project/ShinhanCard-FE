import { useState } from "react";

import clsx from "clsx";

import AssigneeSelector from "./AssigneeSelector";
import FileUploadBox from "./FileUploadBox";
import InquiryEditor from "./InquiryEditor";

const InquiryForm = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section
      className={clsx(
        "flex flex-col gap-10 p-16 bg-white rounded-b-[15px]",
        isDropdownOpen ? "mb-[328px]" : "mb-0"
      )}
    >
      <InquiryEditor />
      <div className="w-full h-[1px] bg-gray-10" />
      <FileUploadBox />
      <div className="w-full h-[1px] bg-gray-10" />
      <AssigneeSelector onDropdownStateChange={setIsDropdownOpen} />
    </section>
  );
};

export default InquiryForm;
