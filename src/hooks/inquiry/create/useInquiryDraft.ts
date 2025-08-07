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

    if (justSavedDraft) return;

    // ✅ 여기에 추가! draftExists에 draft가 있지만 draftId는 아직 null인 경우
    if (draftExists?.result.is_present && draftId === null) {
      const newDraftId = draftExists.result.draft_id;
      setDraftId(newDraftId);
      console.log("➡️ setDraftId 실행됨. 새로운 ID:", newDraftId);
    }

    // ✅ 이 조건이 확실하게 첫 번째로 작동하도록
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

    const { data: existing } = await refetchDraftExists();
    const newDraftId = existing?.result.draft_id ?? null;
    const previousDraftId = draftId;

    if (existing?.result.is_present) {
      console.log("🟨 [모달 조건 검사]");
      console.log(
        "📌 existing.result.is_present:",
        existing?.result.is_present
      );
      console.log("📌 newDraftId:", newDraftId, typeof newDraftId);
      console.log(
        "📌 previousDraftId:",
        previousDraftId,
        typeof previousDraftId
      );
      console.log(
        "📌 비교 결과 (newDraftId !== previousDraftId):",
        newDraftId !== previousDraftId
      );

      if (existing.result.is_present && existing.result.draft_id !== draftId) {
        setDraftId(existing.result.draft_id);
        setIsDraftModalOpen(true);
      } else if (newDraftId !== null) {
        putDraft(
          {
            inquiryId: newDraftId,
            teamId,
            data: draftData,
          },
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
      }
    } else {
      // 🆕 draft 자체가 존재하지 않으면 새로 생성
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
    setFiles(
      files.map(file => ({
        id: file.fileId,
        fileId: file.fileId,
        name: file.fileName,
        size: file.fileSize,
        progress: 100,
        status: "done",
      }))
    );
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
                console.log(draftId);
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
  }, [draftExists?.result.draft_id]);

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
