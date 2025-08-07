import { useEffect, useRef, useState } from "react";

import { useInquiryDraftApi } from "@/hooks/inquiry/create/useInquiryDraftApi";

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

  const saveDraft = async () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }

    const draftData = {
      title,
      content,
      assignee_ids: assigneeIds,
      observer_ids: referenceIds,
      file_ids: fileIds,
    };

    // ✅ 1. 최근 저장했으면 return (가장 먼저 확인)
    if (justSavedDraft) return;

    // ✅ 2. draftId가 있으면 PUT
    if (draftId !== null) {
      putDraft(
        { inquiryId: draftId, teamId, data: draftData },
        {
          onSuccess: () => {
            setIsDraftSaved(true);
            setJustSavedDraft(true);
            prevRef.current = {
              title,
              content,
              assigneeIds,
              referenceIds,
              fileIds,
            };
          },
        }
      );
      return;
    }

    // ✅ 3. 존재 여부 확인 후 POST or 모달
    const { data: existing } = await refetchDraftExists();

    if (existing?.result.is_present) {
      setDraftId(existing.result.draft_id);
      setIsDraftModalOpen(true);
    } else {
      postDraft(
        { teamId, data: draftData },
        {
          onSuccess: res => {
            setDraftId(res.result.inquiry_id);
            setIsDraftSaved(true);
            setJustSavedDraft(true);
          },
        }
      );
    }
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

    prevRef.current = {
      title,
      content,
      assigneeIds: assignees?.map(u => u.userId) ?? [],
      referenceIds: observers?.map(u => u.userId) ?? [],
      fileIds: files.map(f => f.fileId),
    };

    setTitle(title);
    setContent(content);
    setAssigneeIds(assignees?.map(u => u.userId) ?? []);
    setReferenceIds(observers?.map(u => u.userId) ?? []);
    setFileIds(files.map(f => f.fileId));

    handleGroupChange(group.groupId);
    handleDivisionChange(division.divisionId);
    handleTeamChange(team.teamId);

    setDraftId(inquiry_id);
    setIsDraftSaved(true);
    setJustSavedDraft(true);
  };

  const resetDraft = () => {
    if (!draftId || !teamId) return;

    deleteDraft(
      { inquiryId: draftId, teamId },
      {
        onSuccess: () => {
          setDraftId(null);
          postDraft(
            {
              teamId,
              data: {
                title,
                content,
                assignee_ids: assigneeIds,
                observer_ids: referenceIds,
                file_ids: fileIds,
              },
            },
            {
              onSuccess: res => {
                setDraftId(res.result.inquiry_id);
                setIsDraftSaved(true);
                setJustSavedDraft(true);
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
    setJustSavedDraft(false);
    setIsDraftSaved(false);
  };

  useEffect(() => {
    if (draftExists?.result.is_present && draftId === null) {
      setDraftId(draftExists.result.draft_id);
    }
  }, [draftExists, draftId]);

  useEffect(() => {
    if (!isDraftSaved) return;

    const arrayEqual = (a: number[], b: number[]) =>
      a.length === b.length && a.every((v, i) => v === b[i]);

    const changed =
      prevRef.current.title !== title ||
      prevRef.current.content !== content ||
      !arrayEqual(prevRef.current.assigneeIds, assigneeIds) ||
      !arrayEqual(prevRef.current.referenceIds, referenceIds) ||
      !arrayEqual(prevRef.current.fileIds, fileIds);

    if (changed) {
      setIsDraftSaved(false);
    }
  }, [title, content, assigneeIds, referenceIds, fileIds]);

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
