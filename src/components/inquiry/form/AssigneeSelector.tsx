import { useState } from "react";

import { Member } from "@/types/team/user";

import UserMultiSelectInput from "./UserSelectInput";

interface Props {
  onDropdownStateChange: (isOpen: boolean) => void;
  allUsers: Member[];
}

const AssigneeSelector = ({ onDropdownStateChange, allUsers }: Props) => {
  const [openedDropdownIndex, setOpenedDropdownIndex] = useState<number | null>(
    null
  );

  const handleToggle = (index: number, isOpen: boolean) => {
    if (isOpen) {
      setOpenedDropdownIndex(index);
      onDropdownStateChange(true);
    } else {
      setOpenedDropdownIndex(prev => (prev === index ? null : prev));
      const hasOpen =
        openedDropdownIndex !== null && openedDropdownIndex !== index;
      onDropdownStateChange(hasOpen);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <UserMultiSelectInput
        label="답변 담당자"
        placeholder="필수입력"
        maxCount={3}
        allUsers={allUsers}
        isOpen={openedDropdownIndex === 0}
        onDropdownToggle={isOpen => handleToggle(0, isOpen)}
      />
      <UserMultiSelectInput
        label="답변 참조자"
        placeholder="선택입력"
        maxCount={5}
        allUsers={allUsers}
        isOpen={openedDropdownIndex === 1}
        onDropdownToggle={isOpen => handleToggle(1, isOpen)}
      />
    </div>
  );
};

export default AssigneeSelector;
