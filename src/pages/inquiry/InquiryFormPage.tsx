import { useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";
import { useLocation, useSearchParams } from "react-router-dom";

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

type FormLocationState = {
  teamId?: number;
  inquiryId?: number;
  toUserId?: number;
  groupName?: string;
  divisionName?: string;
  teamName?: string;
  group_name?: string;
  division_name?: string;
  team_name?: string;
};

const firstDefined = <T,>(...vals: Array<T | undefined>) =>
  vals.find(v => v !== undefined);

const norm = (s?: string) =>
  (s ?? "").trim().replace(/\s+/g, " ").toLowerCase();

const InquiryFormPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [missingField, setMissingField] = useState<
    null | "team" | "title" | "content" | "assignee"
  >(null);

  const [searchParams] = useSearchParams();
  const location = useLocation() as { state?: FormLocationState };

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

  const groupNameFromState = firstDefined(
    location.state?.groupName,
    location.state?.group_name
  );
  const divisionNameFromState = firstDefined(
    location.state?.divisionName,
    location.state?.division_name
  );
  const teamNameFromState = firstDefined(
    location.state?.teamName,
    location.state?.team_name
  );

  const toUserId = location.state?.toUserId; // 전달받은 담당자 ID

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
  const didInit = useRef(false);
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

  // 담당자 프리셋
  useEffect(() => {
    if (isEdit) return;
    if (toUserId == null) return;
    const id = Number(toUserId);
    if (!Number.isFinite(id) || id <= 0) return;
    setAssigneeIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, [toUserId, isEdit, setAssigneeIds]);

  // 초기 teamId (state 우선, 없으면 쿼리)
  const initialTeamId = useMemo(() => {
    return (
      teamIdFromState ??
      (Number.isFinite(teamIdFromQS) ? teamIdFromQS : undefined)
    );
  }, [teamIdFromState, teamIdFromQS]);

  useEffect(() => {
    if (isEdit) return;
    if (didInit.current) return;

    // group 선택
    if (!groupId && groupNameFromState && groupOptions?.length) {
      const g = groupOptions.find(
        o => norm(o.label) === norm(groupNameFromState)
      );
      if (g) {
        handleGroupChange(g.value);
        return;
      } // 다음 렌더에서 divisionOptions 채워짐
    }

    // division 선택 (group 선택된 뒤에만 시도)
    if (
      groupId &&
      !divisionId &&
      divisionNameFromState &&
      divisionOptions?.length
    ) {
      const d = divisionOptions.find(
        o => norm(o.label) === norm(divisionNameFromState)
      );
      if (d) {
        handleDivisionChange(d.value);
        return;
      } // 다음 렌더에서 teamOptions 채워짐
    }

    // team 선택 (division 선택된 뒤에만 시도)
    if (divisionId && !teamId && teamOptions?.length) {
      // 팀 이름 우선
      if (teamNameFromState) {
        const tByName = teamOptions.find(
          o => norm(o.label) === norm(teamNameFromState)
        );
        if (tByName) {
          handleTeamChange(tByName.value);
          didInit.current = true;
          return;
        }
      }
      // 이름 없으면 teamId fallback
      if (initialTeamId && teamOptions.some(o => o.value === initialTeamId)) {
        handleTeamChange(initialTeamId);
        didInit.current = true;
        return;
      }
    }

    // 세 값이 이미 모두 잡혀 있으면 초기화 끝
    if (groupId && divisionId && teamId) {
      didInit.current = true;
    }
  }, [
    isEdit,
    groupId,
    divisionId,
    teamId,
    groupOptions,
    divisionOptions,
    teamOptions,
    groupNameFromState,
    divisionNameFromState,
    teamNameFromState,
    initialTeamId,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
  ]);

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
    handleClickTempSave,
    restoreDraft,
    resetDraft,
    deleteDraftBeforeSubmit,
    clearDraftState,
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

  const getUserId = (u?: { user_id?: number; userId?: number } | null) =>
    (u?.user_id ?? u?.userId ?? 0) as number;

  // 편집 모드: 상세 불러와서 상태 주입
  useEffect(() => {
    if (!isEdit || !editDetail) return;

    setTitle(editDetail.title ?? "");
    setContent(editDetail.content ?? "");

    const assignees = (editDetail.assignees ?? [])
      .map(getUserId)
      .filter(id => id > 0);
    setAssigneeIds([...new Set(assignees)]);

    const observers = (editDetail.observers ?? [])
      .map(getUserId)
      .filter(id => id > 0);
    setReferenceIds([...new Set(observers)]);

    const detailFiles = (editDetail.files as InquiryFile[] | undefined) ?? [];
    setFileIds(detailFiles.map(f => f.file_id));
    setFiles(
      detailFiles.map(f => ({
        id: f.file_id,
        file_name: f.file_name,
        file_size: f.file_size ?? 0,
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
  }, [
    isEdit,
    editDetail,
    editTeamId,
    setTitle,
    setContent,
    setAssigneeIds,
    setReferenceIds,
    setFileIds,
    setFiles,
    setFromIds,
    handleTeamChange,
    clearDraftState,
  ]);

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
      return;
    }

    if (!teamId) return;

    deleteDraftBeforeSubmit(() => {
      postInquiryMutation.mutate(
        { teamId, data: payload },
        {
          onSuccess: () => {
            setIsConfirmModalOpen(false);
            clearDraftState();
          },
        }
      );
    });
  };

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
            onClick={handleClickTempSave}
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
