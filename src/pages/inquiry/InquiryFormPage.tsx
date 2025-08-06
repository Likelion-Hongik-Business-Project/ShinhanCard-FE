import { useState } from "react";

import clsx from "clsx";

import PencilIcon from "@/assets/svgs/inquiry/pencil.svg";
import Button from "@/components/common/Button";
import InquiryForm from "@/components/inquiry/form/InquiryForm";
import InquiryFormModal from "@/components/inquiry/form/InquiryFormModal";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";
import { useInquiryApi } from "@/hooks/inquiry/useInquiryApi";
import { useInquiryDraftApi } from "@/hooks/inquiry/useInquiryDraftApi";
import { useInquiryFormState } from "@/hooks/inquiry/useInquiryFormState";
import { useOrganizationSelector } from "@/hooks/team/useOrganizationSelector";
import { PostInquiryRequest } from "@/types/inquiry/inquiryApi.type";

const InquiryFormPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [missingField, setMissingField] = useState<
    null | "team" | "title" | "content" | "assignee"
  >(null);

  const {
    title,
    setTitle,
    content,
    setContent,
    assigneeId,
    setAssigneeId,
    referenceIds,
    setReferenceIds,
    fileIds,
    setFileIds,
  } = useInquiryFormState();

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

  const { postInquiryMutation } = useInquiryApi();
  const { useCheckDraftExists, usePostInquiryDraftMutation } =
    useInquiryDraftApi();

  const { data: draftExists, isLoading } = useCheckDraftExists(teamId ?? 0);
  const { mutate: postDraft } = usePostInquiryDraftMutation();

  const validateFields = (): typeof missingField => {
    if (!teamId) return "team";
    if (!title.trim()) return "title";
    if (!content.trim()) return "content";
    if (assigneeId === null) return "assignee";
    return null;
  };

  const handleDraftClick = () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }

    if (!teamId || isLoading) return;

    if (draftExists?.result) {
      setIsDraftModalOpen(true);
    } else {
      postDraft({
        teamId,
        data: {
          title,
          content,
          assignee_ids: assigneeId !== null ? [assigneeId] : [],
          observer_ids: referenceIds,
          file_ids: fileIds,
        },
      });
    }
  };

  const handleSubmit = () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const confirmSubmit = () => {
    if (!teamId) return;

    const payload: PostInquiryRequest = {
      title,
      content,
      assignee_ids: assigneeId !== null ? [assigneeId] : [],
      observer_ids: referenceIds,
      file_ids: fileIds,
    };

    postInquiryMutation.mutate({ teamId, data: payload });
    setIsConfirmModalOpen(false);
  };

  const handleRestore = () => {
    setIsDraftModalOpen(false);
    // TODO: 임시저장 불러오기 로직
  };

  const handleReset = () => {
    setIsDraftModalOpen(false);
    // TODO: 새로 작성 로직
  };

  return (
    <section
      className={clsx("flex flex-col w-full", isDropdownOpen && "pb-[220px]")}
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
        <Button className="white" onClick={handleDraftClick}>
          임시저장
        </Button>
        <Button buttonType="blue" onClick={handleSubmit}>
          <PencilIcon />
          <span className="text-heading3 text-white">문의 등록하기</span>
        </Button>
      </div>

      <InquiryFormModal
        missingField={missingField}
        onCloseMissing={() => setMissingField(null)}
        isDraftOpen={isDraftModalOpen}
        onCloseDraft={() => setIsDraftModalOpen(false)}
        onRestoreDraft={handleRestore}
        onResetDraft={handleReset}
        isConfirmOpen={isConfirmModalOpen}
        onCloseConfirm={() => setIsConfirmModalOpen(false)}
        onConfirmSubmit={confirmSubmit}
      />
    </section>
  );
};

export default InquiryFormPage;
