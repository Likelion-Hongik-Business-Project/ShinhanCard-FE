import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import PencilIcon from "@/assets/svgs/inquiry/pencil.svg";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import InquiryLeaveModal from "@/components/inquiry/common/InquiryLeaveModal";
import InquiryForm from "@/components/inquiry/form/InquiryForm";
import InquiryFormModal from "@/components/inquiry/form/InquiryFormModal";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";
import { useInquiryDraft } from "@/hooks/inquiry/create/useInquiryDraft";
import { useInquiryFormState } from "@/hooks/inquiry/create/useInquiryFormState";
import {
  useGetTeamInquiryDetail,
  useInquiryApi,
} from "@/hooks/inquiry/useInquiryApi";
import { useLeaveGuard } from "@/hooks/inquiry/useLeaveGuard";
import { useInitialOrgSelection } from "@/hooks/team/useInitialOrgSelection";
import { useOrganizationSelector } from "@/hooks/team/useOrganizationSelector";
import { retryDelay, retryIf404 } from "@/utils/queryRetryUtils";
import { InquiryFile } from "@/types/file/file.type";
import { PostInquiryRequest } from "@/types/inquiry/inquiryApi.type";

import { getInquiryDetail } from "@/apis/inquiry/detail/inquiryDetailApi";

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

const InquiryFormPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [missingField, setMissingField] = useState<
    null | "team" | "title" | "content" | "assignee"
  >(null);

  const [searchParams] = useSearchParams();
  const location = useLocation() as { state?: FormLocationState };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mode = searchParams.get("mode");
  const isEdit = mode === "edit";
  const appliedEditRef = useRef(false);

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

  const toUserId = location.state?.toUserId;

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

  // 담당자 프리셋(초기 1회만)
  useEffect(() => {
    if (isEdit) return;
    if (toUserId == null) return;
    const id = Number(toUserId);
    if (!Number.isFinite(id) || id <= 0) return;
    setAssigneeIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, [toUserId, isEdit, setAssigneeIds]);

  // 초기 teamId 계산
  const initialTeamId = useMemo(
    () =>
      teamIdFromState ??
      (Number.isFinite(teamIdFromQS) ? teamIdFromQS : undefined),
    [teamIdFromState, teamIdFromQS]
  );

  useInitialOrgSelection({
    isEdit,
    names: {
      group: groupNameFromState,
      division: divisionNameFromState,
      team: teamNameFromState,
    },
    initialTeamId,
    ids: { groupId, divisionId, teamId },
    options: {
      groups: groupOptions,
      divisions: divisionOptions,
      teams: teamOptions,
    },
    handlers: {
      onGroup: handleGroupChange,
      onDivision: handleDivisionChange,
      onTeam: handleTeamChange,
    },
  });

  // 필드 유효성 검사
  const validateFields = useCallback((): typeof missingField => {
    if (!teamId) return "team";
    if (!title.trim()) return "title";
    if (!content.trim()) return "content";
    if (assigneeIds.length === 0) return "assignee";
    return null;
  }, [teamId, title, content, assigneeIds.length]);

  const {
    isDraftSaved,
    isDraftModalOpen,
    setIsDraftModalOpen,
    handleClickTempSave,
    restoreDraft,
    resetDraft,
    deleteDraftBeforeSubmit,
    clearDraftState,
    setFilesSync,
    hasUploadingFiles,
    draftModalMode,
    saveCurrentAsDraftReplacingExisting,
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

  const fileIdsForSubmit = useMemo(
    () =>
      (files ?? [])
        .filter(
          f =>
            f.status === "done" &&
            typeof f.file_id === "number" &&
            f.file_id! > 0
        )
        .map(f => f.file_id!),
    [files]
  );

  const leaveSnapshot = useMemo(
    () => ({
      teamId,
      title: title?.trim() ?? "",
      content: content?.trim() ?? "",
      assigneeIds: [...assigneeIds].sort(),
      referenceIds: [...referenceIds].sort(),
      fileIds: fileIdsForSubmit, // 업로드 완료 파일만
    }),
    [teamId, title, content, assigneeIds, referenceIds, fileIdsForSubmit]
  );

  // prefetch/navigate 동안에도 로딩/가드 OFF를 유지하기 위한 로컬 상태
  const [isRedirecting, setIsRedirecting] = useState(false);
  const mountedRef = useRef(true);
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  const {
    modalProps: leaveModal, // { isOpen, onConfirm, onCancel }
    setClean,
    setBaseline,
    runWithBypass,
  } = useLeaveGuard(leaveSnapshot, {
    enabled: !isBlocking && !isConfirmModalOpen && !isRedirecting, // ⬅️ 보강
    initializeClean: !isEdit,
    beforeUnload: !isBlocking && !isRedirecting,
  });

  // 편집 모드 데이터 주입
  useEffect(() => {
    if (!isEdit || !editDetail) return;
    if (appliedEditRef.current) return;

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

    setFilesSync(
      detailFiles.map(f => ({
        id: f.file_id,
        file_id: f.file_id,
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
    appliedEditRef.current = true;
    setClean();
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

  const handleSubmit = useCallback(() => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }
    if (hasUploadingFiles()) {
      setMissingField(null);
      setIsConfirmModalOpen(false);
      return;
    }
    if (isEdit && editTeamId && editInquiryId) {
      confirmSubmit();
      return;
    }
    setIsConfirmModalOpen(true);
  }, [validateFields, isEdit, editTeamId, editInquiryId, hasUploadingFiles]);

  const confirmSubmit = useCallback(() => {
    const payload: PostInquiryRequest = {
      title,
      content,
      assignee_ids: assigneeIds,
      observer_ids: referenceIds,
      file_ids: fileIdsForSubmit,
    };

    const cleanSnapshot = {
      teamId,
      title: "",
      content: "",
      assigneeIds: [] as number[],
      referenceIds: [] as number[],
      fileIds: [] as number[],
    };

    if (isEdit && editTeamId && editInquiryId) {
      putInquiryMutation.mutate(
        { team_id: editTeamId, inquiry_id: editInquiryId, data: payload },
        {
          onSuccess: () => {
            setIsConfirmModalOpen(false);
            setBaseline(cleanSnapshot);
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
          onSuccess: async res => {
            const inquiryId = res.result.inquiry_id;

            // 등록 직후: 폼 초기 상태를 baseline으로 고정
            setBaseline(cleanSnapshot);
            // 외부/드래프트 상태 초기화 (모달은 닫지 않음)
            clearDraftState();
            // 상세 prefetch & 이동 동안에도 "등록중..." 유지
            setIsRedirecting(true);
            try {
              await runWithBypass(async () => {
                await queryClient.prefetchQuery({
                  queryKey: ["teamInquiry", teamId, inquiryId],
                  queryFn: () => getInquiryDetail(teamId, inquiryId),
                  retry: retryIf404,
                  retryDelay,
                });

                navigate(`/teams/${teamId}/inquiries/${inquiryId}`);
              });
            } finally {
              if (mountedRef.current) setIsRedirecting(false);
            }
          },
        }
      );
    });
  }, [
    isEdit,
    editTeamId,
    editInquiryId,
    teamId,
    title,
    content,
    assigneeIds,
    referenceIds,
    fileIdsForSubmit,
    putInquiryMutation,
    postInquiryMutation,
    deleteDraftBeforeSubmit,
    clearDraftState,
    setBaseline,
    navigate,
    queryClient,
    runWithBypass,
  ]);

  const pageLoading = isLoadingEdit;
  const isBusy = pageLoading || isBlocking || isRedirecting;

  if (pageLoading) {
    return <LoadingSpinner fullscreen={true} />;
  }

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
            disabled={isEdit || isBusy}
          />
          <SelectDropdown
            options={divisionOptions}
            value={divisionId ?? 0}
            onChange={handleDivisionChange}
            placeholder="본부 선택"
            disabled={isEdit || !groupId || isBusy}
          />
          <SelectDropdown
            options={teamOptions}
            value={teamId ?? 0}
            onChange={handleTeamChange}
            placeholder="팀 선택"
            disabled={isEdit || !divisionId || isBusy}
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
            disabled={isDraftSaved || isBusy}
          >
            {isDraftSaved ? "임시저장완료" : "임시저장"}
          </Button>
        )}
        <Button buttonType="blue" onClick={handleSubmit} disabled={isBusy}>
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
        isSubmitting={isBlocking || isRedirecting}
        draftModalMode={draftModalMode}
        onOverwriteDraft={saveCurrentAsDraftReplacingExisting}
      />

      <InquiryLeaveModal {...leaveModal} />
    </section>
  );
};

export default InquiryFormPage;
