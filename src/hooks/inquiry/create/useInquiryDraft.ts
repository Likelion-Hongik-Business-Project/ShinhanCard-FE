import { useEffect, useRef, useState } from "react";

import { useInquiryDraftApi } from "@/hooks/inquiry/create/useInquiryDraftApi";
import { UploadFile } from "@/types/file/file.type";

export interface UseInquiryDraftParams {
  teamId: number;
  title: string;
  content: string;
  assigneeIds: number[];
  referenceIds: number[];
  fileIds: number[];
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  setAssigneeIds: (v: number[]) => void;
  setReferenceIds: (v: number[]) => void;
  setFileIds: (v: number[]) => void;
  setFiles: (v: UploadFile[]) => void;
  handleGroupChange: (id: number) => void;
  handleDivisionChange: (id: number) => void;
  handleTeamChange: (id: number) => void;
  validateFields: () => "team" | "title" | "content" | "assignee" | null;
  setMissingField: (
    v: "team" | "title" | "content" | "assignee" | null
  ) => void;
}

export const useInquiryDraft = ({
  teamId,
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
}: UseInquiryDraftParams) => {
  const [draftId, setDraftId] = useState<number | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [justSavedDraft, setJustSavedDraft] = useState(false);

  const prevRef = useRef({
    title,
    content,
    assigneeIds,
    referenceIds,
    fileIds,
  });

  const {
    useCheckDraftExists,
    usePostInquiryDraftMutation,
    useGetInquiryDraft,
    useDeleteInquiryDraftMutation,
    usePutInquiryDraftMutation,
  } = useInquiryDraftApi();

  const { data: draftExists, refetch: refetchDraftExists } =
    useCheckDraftExists(teamId, false);
  const { refetch: fetchDraft } = useGetInquiryDraft(
    teamId,
    draftExists?.result.draft_id ?? 0,
    !!teamId && !!draftExists?.result.draft_id
  );
  const { mutate: postDraft } = usePostInquiryDraftMutation();
  const { mutate: putDraft } = usePutInquiryDraftMutation();
  const { mutate: deleteDraft } = useDeleteInquiryDraftMutation();

  const buildDraftPayload = () => ({
    title,
    content,
    assignee_ids: assigneeIds,
    observer_ids: referenceIds,
    file_ids: fileIds,
  });

  const saveDraft = async () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }

    const payload = buildDraftPayload();
    if (justSavedDraft) return;

    // case 1: draftId 존재 → PUT
    if (draftId !== null) {
      putDraft(
        { inquiryId: draftId, teamId, data: payload },
        { onSuccess: handleSaveSuccess }
      );
      return;
    }

    // case 2: draftExists만 있고 draftId는 없을 때 → draftId 세팅만
    if (draftExists?.result.is_present && draftId === null) {
      setDraftId(draftExists.result.draft_id);
      return;
    }

    // case 3: 새로 조회 후 비교
    const idFromState = draftExists?.result.draft_id ?? null;

    if (draftExists?.result.is_present) {
      if (draftId !== null && draftId !== idFromState) {
        setDraftId(idFromState);
        setIsDraftModalOpen(true);
        return;
      }

      putDraft(
        { inquiryId: idFromState!, teamId, data: payload },
        { onSuccess: handleSaveSuccess }
      );
    } else {
      postDraft(
        { teamId, data: payload },
        {
          onSuccess: res => {
            setDraftId(res.result.inquiry_id);
            handleSaveSuccess();
          },
        }
      );
    }
  };

  const handleSaveSuccess = () => {
    setIsDraftSaved(true);
    setJustSavedDraft(true);
    prevRef.current = { title, content, assigneeIds, referenceIds, fileIds };
  };

  const restoreDraft = async () => {
    setIsDraftModalOpen(false);
    const { data } = await fetchDraft();
    if (!data?.result) return;

    const {
      title,
      content,
      assignees,
      observers,
      group,
      division,
      team,
      files,
      inquiry_id,
    } = data.result;

    setTitle(title);
    setContent(content);
    setAssigneeIds(assignees?.map(u => u.userId) ?? []);
    setReferenceIds(observers?.map(u => u.userId) ?? []);
    setFileIds(files.map(f => f.fileId));
    setFiles(
      files.map(f => ({
        id: f.fileId,
        fileId: f.fileId,
        name: f.fileName,
        size: f.fileSize,
        progress: 100,
        status: "done",
      }))
    );

    handleGroupChange(group.groupId);
    handleDivisionChange(division.divisionId);
    handleTeamChange(team.teamId);

    setDraftId(inquiry_id);
    handleSaveSuccess();
  };

  const resetDraft = () => {
    if (!draftId || !teamId) return;

    deleteDraft(
      { inquiryId: draftId, teamId },
      {
        onSuccess: () => {
          setDraftId(null);
          postDraft(
            { teamId, data: buildDraftPayload() },
            {
              onSuccess: res => {
                setDraftId(res.result.inquiry_id);
                handleSaveSuccess();
              },
            }
          );
        },
      }
    );

    setIsDraftModalOpen(false);
  };

  const clearDraftState = () => {
    setDraftId(null);
    setIsDraftSaved(false);
    setJustSavedDraft(false);
  };

  useEffect(() => {
    if (draftExists?.result.is_present && draftId === null) {
      setDraftId(draftExists.result.draft_id);
    }
  }, [draftExists?.result.draft_id]);

  useEffect(() => {
    if (!isDraftSaved) return;

    const isChanged = (
      prev: typeof prevRef.current,
      current: typeof prevRef.current
    ) =>
      prev.title !== current.title ||
      prev.content !== current.content ||
      !arraysEqual(prev.assigneeIds, current.assigneeIds) ||
      !arraysEqual(prev.referenceIds, current.referenceIds) ||
      !arraysEqual(prev.fileIds, current.fileIds);

    if (
      isChanged(prevRef.current, {
        title,
        content,
        assigneeIds,
        referenceIds,
        fileIds,
      })
    ) {
      setIsDraftSaved(false);
    }
  }, [title, content, assigneeIds, referenceIds, fileIds]);

  const arraysEqual = (a: number[], b: number[]) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  useEffect(() => {
    if (!teamId) return;

    // 팀이 바뀌면 상태 초기화
    setDraftId(null);
    setIsDraftSaved(false);
    setJustSavedDraft(false);

    // draft 존재 여부 다시 조회
    refetchDraftExists();
  }, [teamId]);

  return {
    isDraftSaved,
    isDraftModalOpen,
    setIsDraftModalOpen,
    saveDraft,
    restoreDraft,
    resetDraft,
    clearDraftState,
    draftId,
    deleteDraft,
  };
};
