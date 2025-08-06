import { useState } from "react";

import { AssigneeUser } from "@/types/team/user.type";

import UserMultiSelectInput from "./UserMultiSelectInput";

interface Props {
  onDropdownStateChange: (isOpen: boolean) => void;
  allUsers: AssigneeUser[];
  assigneeId: number | null;
  referenceIds: number[];
  setAssigneeId: (id: number | null) => void;
  setReferenceIds: (ids: number[]) => void;
}

const AssigneeSelector = ({
  onDropdownStateChange,
  allUsers,
  assigneeId,
  referenceIds,
  setAssigneeId,
  setReferenceIds,
}: Props) => {
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
        selectedIds={assigneeId !== null ? [assigneeId] : []}
        onChange={(ids: number[]) => setAssigneeId(ids[0] ?? null)}
        isOpen={openedDropdownIndex === 0}
        onDropdownToggle={isOpen => handleToggle(0, isOpen)}
      />

      <UserMultiSelectInput
        label="답변 참조자"
        placeholder="선택입력"
        maxCount={5}
        allUsers={allUsers}
        selectedIds={referenceIds}
        onChange={setReferenceIds}
        isOpen={openedDropdownIndex === 1}
        onDropdownToggle={isOpen => handleToggle(1, isOpen)}
      />
    </div>
  );
};

export default AssigneeSelector;
