import { useEffect, useState } from "react";

import clsx from "clsx";
import { useLocation, useSearchParams } from "react-router-dom"; // ✅ 추가

import PencilIcon from "@/assets/svgs/inquiry/pencil.svg";
import Button from "@/components/common/Button";
import InquiryForm from "@/components/inquiry/form/InquiryForm";
import InquiryFormModal from "@/components/inquiry/form/InquiryFormModal";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";
import { useInquiryDraft } from "@/hooks/inquiry/create/useInquiryDraft";
import { useInquiryFormState } from "@/hooks/inquiry/create/useInquiryFormState";
import {
  useGetTeamInquiryDetail,
  useInquiryApi,
} from "@/hooks/inquiry/useInquiryApi";
import { useOrganizationSelector } from "@/hooks/team/useOrganizationSelector";
import { InquiryFile } from "@/types/file/file.type";
import { PostInquiryRequest } from "@/types/inquiry/inquiryApi.type";

const InquiryFormPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [missingField, setMissingField] = useState<
    null | "team" | "title" | "content" | "assignee"
  >(null);

  const [searchParams] = useSearchParams();
  const location = useLocation() as {
    state?: { teamId?: number; inquiryId?: number };
  };
  const mode = searchParams.get("mode");
  const isEdit = mode === "edit";
  const teamIdQS = searchParams.get("teamId");
  const inquiryIdQS = searchParams.get("inquiryId");
  const teamIdFromQS = teamIdQS !== null ? Number(teamIdQS) : undefined;
  const inquiryIdFromQS =
    inquiryIdQS !== null ? Number(inquiryIdQS) : undefined;
  const teamIdFromState = location.state?.teamId;
  const inquiryIdFromState = location.state?.inquiryId;

  const editTeamId =
    teamIdFromState ??
    (Number.isFinite(teamIdFromQS) ? teamIdFromQS : undefined);
  const editInquiryId =
    inquiryIdFromState ??
    (Number.isFinite(inquiryIdFromQS) ? inquiryIdFromQS : undefined);

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
    setFromIds,
  } = useOrganizationSelector();

  // 필드 유효성 검사
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
    setFiles,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
    validateFields,
    setMissingField,
  });

  const { postInquiryMutation, putInquiryMutation, isBlocking } =
    useInquiryApi();

  const hasEditIds =
    isEdit && editTeamId !== undefined && editInquiryId !== undefined;

  const { data: editData, isLoading: isLoadingEdit } = useGetTeamInquiryDetail(
    editTeamId ?? 0,
    editInquiryId ?? 0
  );

  const editDetail = hasEditIds ? editData?.result : undefined;

  useEffect(() => {
    if (!isEdit || !editDetail) return;

    setTitle(editDetail.title ?? "");
    setContent(editDetail.content ?? "");

    setAssigneeIds(
      (editDetail.assignees ?? []).map(
        (u: { user_id?: number; userId?: number }) => u.user_id ?? u.userId ?? 0
      )
    );
    setReferenceIds(
      (editDetail.observers ?? []).map(
        (u: { user_id?: number; userId?: number }) => u.user_id ?? u.userId ?? 0
      )
    );

    const detailFiles = (editDetail.files as InquiryFile[] | undefined) ?? [];
    setFileIds(detailFiles.map(f => f.file_id));

    setFiles(
      detailFiles.map(f => ({
        id: f.file_id,
        name: f.file_name,
        size: f.file_size ?? 0,
        progress: 100,
        status: "done" as const,
      }))
    );

    if (
      editDetail.group?.group_id &&
      editDetail.division?.division_id &&
      editDetail.team?.team_id
    ) {
      setFromIds(
        editDetail.group.group_id,
        editDetail.division.division_id,
        editDetail.team.team_id
      );
    } else if (editTeamId) {
      handleTeamChange(editTeamId);
    }

    clearDraftState();
  }, [isEdit, editDetail]);

  const handleSubmit = () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }
    if (isEdit && editTeamId && editInquiryId) {
      confirmSubmit();
      return;
    }
    setIsConfirmModalOpen(true);
  };
  const confirmSubmit = () => {
    const payload: PostInquiryRequest = {
      title,
      content,
      assignee_ids: assigneeIds,
      observer_ids: referenceIds,
      file_ids: fileIds,
    };

    if (isEdit && editTeamId && editInquiryId) {
      putInquiryMutation.mutate(
        { team_id: editTeamId, inquiry_id: editInquiryId, data: payload },
        {
          onSuccess: () => {
            setIsConfirmModalOpen(false);
            clearDraftState();
          },
        }
      );
    } else {
      if (!teamId) return;

      postInquiryMutation.mutate(
        { teamId, data: payload },
        {
          onSuccess: () => {
            setIsConfirmModalOpen(false);
            if (draftId) {
              deleteDraft(
                { inquiryId: draftId, teamId },
                { onSuccess: () => clearDraftState() }
              );
            } else {
              clearDraftState();
            }
          },
        }
      );
    }
  };

  // 임시저장 완료 시 드래프트 클리어
  useEffect(() => {
    if (isDraftSaved) {
      clearDraftState();
    }
  }, [title, content, assigneeIds, referenceIds, fileIds]);

  // 로딩 처리 (편집 모드일 때 상세 로딩 포함)
  const pageLoading = isLoadingEdit;

  return (
    <section
      className={clsx("flex flex-col w-full", isDropdownOpen && "pb-[220px]")}
    >
      <h1 className="text-heading1 text-gray-80 mb-10">
        {isEdit ? "문의 수정하기" : "문의 작성하기"}
      </h1>

      <div className="flex gap-2 flex-col">
        <div className="flex gap-2">
          <SelectDropdown
            options={groupOptions}
            value={groupId ?? 0}
            onChange={handleGroupChange}
            placeholder="그룹 선택"
            disabled={isEdit || pageLoading}
          />
          <SelectDropdown
            options={divisionOptions}
            value={divisionId ?? 0}
            onChange={handleDivisionChange}
            placeholder="본부 선택"
            disabled={isEdit || !groupId || pageLoading}
          />
          <SelectDropdown
            options={teamOptions}
            value={teamId ?? 0}
            onChange={handleTeamChange}
            placeholder="팀 선택"
            disabled={isEdit || !divisionId || pageLoading}
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
        {!isEdit && (
          <Button
            buttonType={isDraftSaved ? "done" : "white"}
            onClick={saveDraft}
            disabled={isDraftSaved}
          >
            {isDraftSaved ? "임시저장완료" : "임시저장"}
          </Button>
        )}
        <Button buttonType="blue" onClick={handleSubmit} disabled={pageLoading}>
          <PencilIcon />
          <span className="text-heading3 text-white">
            {isEdit ? "문의 수정하기" : "문의 등록하기"}
          </span>
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
        isSubmitting={isBlocking}
      />
    </section>
  );
};

export default InquiryFormPage;
