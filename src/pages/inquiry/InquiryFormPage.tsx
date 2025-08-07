import { useEffect, useState } from "react";

import clsx from "clsx";

import PencilIcon from "@/assets/svgs/inquiry/pencil.svg";
import Button from "@/components/common/Button";
import InquiryForm from "@/components/inquiry/form/InquiryForm";
import InquiryFormModal from "@/components/inquiry/form/InquiryFormModal";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";
import { useInquiryDraft } from "@/hooks/inquiry/create/useInquiryDraft";
import { useInquiryFormState } from "@/hooks/inquiry/create/useInquiryFormState";
import { useInquiryApi } from "@/hooks/inquiry/useInquiryApi";
import { useOrganizationSelector } from "@/hooks/team/useOrganizationSelector";
import { PostInquiryRequest } from "@/types/inquiry/inquiryApi.type";

const InquiryFormPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [missingField, setMissingField] = useState<
    null | "team" | "title" | "content" | "assignee"
  >(null);

  const {
    title,
    setTitle,
    content,
    setContent,
    assigneeIds,
    setAssigneeIds,
    referenceIds,
    setReferenceIds,
    fileIds,
    setFileIds,
    files,
    setFiles,
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

  // 필드 유효성 검사 함수
  const validateFields = (): typeof missingField => {
    if (!teamId) return "team";
    if (!title.trim()) return "title";
    if (!content.trim()) return "content";
    if (assigneeIds.length === 0) return "assignee";
    return null;
  };

  const {
    isDraftSaved,
    isDraftModalOpen,
    setIsDraftModalOpen,
    saveDraft,
    restoreDraft,
    resetDraft,
    clearDraftState,
    draftId,
    deleteDraft,
  } = useInquiryDraft({
    teamId: teamId ?? 0,
    title,
    content,
    assigneeIds,
    referenceIds,
    fileIds,
    setTitle,
    setContent,
    setAssigneeIds,
    setReferenceIds,
    setFileIds,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
    validateFields,
    setMissingField,
  });

  const { postInquiryMutation } = useInquiryApi();

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
      assignee_ids: assigneeIds,
      observer_ids: referenceIds,
      file_ids: fileIds,
    };

    postInquiryMutation.mutate(
      { teamId, data: payload },
      {
        onSuccess: () => {
          setIsConfirmModalOpen(false);

          if (draftId) {
            deleteDraft(
              { inquiryId: draftId, teamId },
              {
                onSuccess: () => {
                  clearDraftState();
                },
              }
            );
          } else {
            clearDraftState();
          }
        },
      }
    );
  };

  useEffect(() => {
    if (isDraftSaved) {
      clearDraftState();
    }
  }, [title, content, assigneeIds, referenceIds, fileIds]);

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
          assigneeIds={assigneeIds}
          referenceIds={referenceIds}
          fileIds={fileIds}
          files={files}
          setTitle={setTitle}
          setContent={setContent}
          setAssigneeIds={setAssigneeIds}
          setReferenceIds={setReferenceIds}
          setFileIds={setFileIds}
          setFiles={setFiles}
          onDropdownStateChange={setIsDropdownOpen}
        />
      </div>

      <div className="flex gap-8 w-full justify-end mt-10">
        <Button className="white" onClick={saveDraft} disabled={isDraftSaved}>
          {isDraftSaved ? "임시저장완료" : "임시저장"}
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
        onRestoreDraft={restoreDraft}
        onResetDraft={resetDraft}
        isConfirmOpen={isConfirmModalOpen}
        onCloseConfirm={() => setIsConfirmModalOpen(false)}
        onConfirmSubmit={confirmSubmit}
      />
    </section>
  );
};

export default InquiryFormPage;
