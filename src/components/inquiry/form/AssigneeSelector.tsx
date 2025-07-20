import UserMultiSelectInput from "./UserSelectInput";

const AssigneeSelector = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <UserMultiSelectInput
        label="답변 담당자"
        placeholder="필수입력"
        maxCount={3}
      />
      <UserMultiSelectInput
        label="답변 참조자"
        placeholder="선택입력"
        maxCount={5}
      />
    </div>
  );
};

export default AssigneeSelector;
