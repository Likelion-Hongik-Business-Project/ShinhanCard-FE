import { useState } from "react";

import clsx from "clsx";

import AssigneeSelector from "./AssigneeSelector";
import FileUploadBox from "./FileUploadBox";
import InquiryEditor from "./InquiryEditor";

import { USERS } from "@/mocks/usersMock";

interface InquiryFormProps {
  group: string;
  division: string;
  team: string;
}

const InquiryForm = ({ group, division, team }: InquiryFormProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredUsers = USERS.filter(
    user =>
      user.group_name === group &&
      user.division_name === division &&
      user.team_name === team
  );

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
      <AssigneeSelector
        onDropdownStateChange={setIsDropdownOpen}
        users={filteredUsers}
      />
    </section>
  );
};

export default InquiryForm;
