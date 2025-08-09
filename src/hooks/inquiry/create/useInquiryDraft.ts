import { useEffect, useRef, useState } from "react";

import { useInquiryDraftApi } from "@/hooks/inquiry/create/useInquiryDraftApi";
import { UploadFile } from "@/types/file/file.type";
import { AssigneeUser, Division, Group, Team } from "@/types/team/user.type";

export interface InquiryDraftFile {
  fileId: number;
  fileName: string;
  fileSize: number;
}

export interface InquiryDraftResponse {
  inquiry_id: number;
  title: string;
  content: string;
  assignees: AssigneeUser[];
  observers: AssigneeUser[];
  files: InquiryDraftFile[];
  group: Group;
  division: Division;
  team: Team;
}

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

const arrEq = (a: number[] = [], b: number[] = []) => {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  for (const x of b) if (!s.has(x)) return false;
  return true;
};

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
    draftExists?.result?.draft_id ?? 0,
    !!teamId && !!draftExists?.result?.draft_id
  );

  const { mutate: postDraft } = usePostInquiryDraftMutation();
  const { mutate: putDraft } = usePutInquiryDraftMutation();
  const { mutate: deleteDraft } = useDeleteInquiryDraftMutation();

  useEffect(() => {
    if (teamId && draftExists?.result?.is_present) {
      setDraftId(draftExists.result.draft_id);
    }
  }, [teamId, draftExists?.result?.is_present, draftExists?.result?.draft_id]);

  useEffect(() => {
    if (!isDraftSaved) return;

    const changed =
      prevRef.current.title !== title ||
      prevRef.current.content !== content ||
      !arrEq(prevRef.current.assigneeIds, assigneeIds) ||
      !arrEq(prevRef.current.referenceIds, referenceIds) ||
      !arrEq(prevRef.current.fileIds, fileIds);

    if (changed) setIsDraftSaved(false);
  }, [title, content, assigneeIds, referenceIds, fileIds, isDraftSaved]);

  const saveDraft = async () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }
    if (justSavedDraft) return;

    const draftData = {
      title,
      content,
      assignee_ids: assigneeIds ?? [],
      observer_ids: referenceIds ?? [],
      file_ids: fileIds ?? [],
    };

    const { data: latest } = await refetchDraftExists();
    const serverHas = Boolean(latest?.result?.is_present);
    const serverId = latest?.result?.draft_id ?? null;

    if (serverHas && serverId != null) {
      if (draftId == null) setDraftId(serverId);
      putDraft(
        { inquiryId: serverId, teamId, data: draftData },
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
            setTimeout(() => setJustSavedDraft(false), 400);
          },
        }
      );
      return;
    }

    postDraft(
      { teamId, data: draftData },
      {
        onSuccess: res => {
          setDraftId(res.result.inquiry_id);
          setIsDraftSaved(true);
          setJustSavedDraft(true);
          prevRef.current = {
            title,
            content,
            assigneeIds,
            referenceIds,
            fileIds,
          };
          setTimeout(() => setJustSavedDraft(false), 400);
        },
      }
    );
  };

  const restoreDraft = async () => {
    setIsDraftModalOpen(false);

    const { data } = await fetchDraft();
    const r = data?.result as InquiryDraftResponse | undefined;
    if (!r) return;

    const restoredAssignees = r.assignees?.map(u => u.user_id) ?? [];
    const restoredObservers = r.observers?.map(u => u.user_id) ?? [];
    const restoredFiles = r.files ?? [];

    setTitle(r.title);
    setContent(r.content);
    setAssigneeIds(restoredAssignees);
    setReferenceIds(restoredObservers);
    setFileIds(restoredFiles.map(f => f.fileId));
    setFiles(
      restoredFiles.map(file => ({
        id: file.fileId,
        fileId: file.fileId,
        name: file.fileName,
        size: file.fileSize,
        progress: 100,
        status: "done" as const,
      }))
    );

    handleGroupChange(r.group.group_id);
    handleDivisionChange(r.division.division_id);
    handleTeamChange(r.team.team_id);

    setDraftId(r.inquiry_id);
    setIsDraftSaved(true);
    setJustSavedDraft(true);

    prevRef.current = {
      title: r.title,
      content: r.content,
      assigneeIds: restoredAssignees,
      referenceIds: restoredObservers,
      fileIds: restoredFiles.map(f => f.fileId),
    };

    setTimeout(() => setJustSavedDraft(false), 400);
  };

  const resetDraft = () => {
    if (!draftId || !teamId) return;

    deleteDraft(
      { inquiryId: draftId, teamId },
      {
        onSuccess: () => {
          const draftData = {
            title,
            content,
            assignee_ids: assigneeIds ?? [],
            observer_ids: referenceIds ?? [],
            file_ids: fileIds ?? [],
          };
          postDraft(
            { teamId, data: draftData },
            {
              onSuccess: res => {
                setDraftId(res.result.inquiry_id);
                setIsDraftSaved(true);
                setJustSavedDraft(true);
                prevRef.current = {
                  title,
                  content,
                  assigneeIds,
                  referenceIds,
                  fileIds,
                };
                setTimeout(() => setJustSavedDraft(false), 400);
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
    draftId,
    isDraftSaved,
    isDraftModalOpen,

    setIsDraftModalOpen,

    saveDraft,
    restoreDraft,
    resetDraft,
    clearDraftState,

    deleteDraft,
  };
};
