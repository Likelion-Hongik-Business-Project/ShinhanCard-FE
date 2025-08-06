import { useState } from "react";

import clsx from "clsx";

import PencilIcon from "@/assets/svgs/inquiry/pencil.svg";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import InquiryForm from "@/components/inquiry/form/InquiryForm";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";
import { useInquiryApi } from "@/hooks/inquiry/useInquiryApi";
import { useOrganizationSelector } from "@/hooks/team/useOrganizationSelector";
import { PostInquiryRequest } from "@/types/inquiry/inquiryApi.type";

const InquiryFormPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const {
    groupId,
    divisionId,
    teamId,
    groupOptions,
    divisionOptions,
    teamOptions,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
  } = useOrganizationSelector();

  // 문의 입력값 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [referenceIds, setReferenceIds] = useState<number[]>([]);
  const [fileIds, setFileIds] = useState<number[]>([]);

  const { postInquiryMutation } = useInquiryApi();

  const handleSubmit = () => {
    if (!teamId) return;

    const payload: PostInquiryRequest = {
      title,
      content,
      assignee_ids: assigneeId !== null ? [assigneeId] : [],
      observer_ids: referenceIds,
      file_ids: fileIds,
    };

    postInquiryMutation.mutate({
      teamId,
      data: payload,
    });
  };

  const handleRestore = () => {
    setIsDraftModalOpen(false);
    // 불러오기 로직 실행
  };

  const handleReset = () => {
    setIsDraftModalOpen(false);
    // 새로 작성 로직 (임시저장 clear 등)
  };

  return (
    <section
      className={clsx(
        "flex flex-col w-full",
        isDropdownOpen ? "pb-[220px]" : ""
      )}
    >
      <h1 className="text-heading1 text-gray-80 mb-10">문의 작성하기</h1>

      <div className="flex gap-2 flex-col">
        <div className="flex gap-2">
          <SelectDropdown
            options={groupOptions}
            value={groupId ?? 0}
            onChange={handleGroupChange}
            placeholder="그룹 선택"
          />
          <SelectDropdown
            options={divisionOptions}
            value={divisionId ?? 0}
            onChange={handleDivisionChange}
            placeholder="본부 선택"
            disabled={!groupId}
          />
          <SelectDropdown
            options={teamOptions}
            value={teamId ?? 0}
            onChange={handleTeamChange}
            placeholder="팀 선택"
            disabled={!divisionId}
          />
        </div>

        <InquiryForm
          teamId={teamId ?? 0}
          title={title}
          content={content}
          assigneeId={assigneeId}
          referenceIds={referenceIds}
          setTitle={setTitle}
          setContent={setContent}
          setAssigneeId={setAssigneeId}
          setReferenceIds={setReferenceIds}
          setFileIds={setFileIds}
          onDropdownStateChange={setIsDropdownOpen}
        />
      </div>

      <div className="flex gap-8 w-full justify-end mt-10">
        <Button className="white" onClick={() => setIsDraftModalOpen(true)}>
          임시저장
        </Button>
        <Button buttonType="blue" onClick={handleSubmit}>
          <PencilIcon />
          <span className="text-heading3 text-white">문의 등록하기</span>
        </Button>
      </div>

      <Modal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        title={"임시저장된 글이 있습니다.\n불러오시겠습니까?"}
        description="새로 작성하면 기존 임시저장된 글은 사라집니다."
        buttons={[
          {
            label: "새로 작성",
            type: "white",
            onClick: handleReset,
          },
          {
            label: "불러오기",
            type: "blue",
            onClick: handleRestore,
          },
        ]}
      />
    </section>
  );
};

export default InquiryFormPage;
