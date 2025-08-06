// hooks/inquiry/useInquiryDraft.ts

import { useState } from "react";

import { useInquiryDraftApi } from "@/hooks/inquiry/useInquiryDraftApi";

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
  const [, setJustSavedDraft] = useState(false);

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
    draftExists?.result.draft_id ?? 0
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

    if (draftId) {
      // 이미 있는 draft → 수정
      putDraft(
        { inquiryId: draftId, teamId, data: draftData },
        { onSuccess: () => setIsDraftSaved(true) }
      );
      return;
    }

    // 처음 저장하는 경우 → 존재 여부 확인
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
            setJustSavedDraft(true);
            setIsDraftSaved(true);
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

  return {
    isDraftSaved,
    isDraftModalOpen,
    setIsDraftModalOpen,
    saveDraft,
    restoreDraft,
    resetDraft,
    clearDraftState,
  };
};
