import { useEffect, useRef, useState } from "react";

import { useInquiryDraftApi } from "@/hooks/inquiry/create/useInquiryDraftApi";
import { UploadFile } from "@/types/file/file.type";
import { GetInquiryDraftResponse } from "@/types/inquiry/inquiryDraftApi.type";

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

  // 한 번이라도 불러오거나(restore) 새로 생성(post)해서 활성화되면 이후엔 PUT 고정
  const [hasActivatedDraft, setHasActivatedDraft] = useState(false);

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

  const markSaved = (snapshot?: {
    title: string;
    content: string;
    assigneeIds: number[];
    referenceIds: number[];
    fileIds: number[];
  }) => {
    setIsDraftSaved(true);
    setJustSavedDraft(true);
    if (snapshot) prevRef.current = snapshot;
    setTimeout(() => setJustSavedDraft(false), 400);
  };

  const buildDraftPayload = () => ({
    title,
    content,
    assignee_ids: assigneeIds ?? [],
    observer_ids: referenceIds ?? [],
    file_ids: fileIds ?? [],
  });

  /**
   * 임시저장 버튼 클릭 핸들러 (요구사항의 "임시저장 x → 클릭 시 바로 Post" / "임시저장 o → 모달")
   * - 서버에 임시저장 없음 → 바로 POST
   * - 서버에 임시저장 있음 & 아직 활성화 전(hasActivatedDraft=false) → 모달 오픈
   * - 이미 활성화됨(hasActivatedDraft=true) → PUT
   */
  const handleClickTempSave = async () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }
    if (justSavedDraft) return;

    const { data: latest } = await refetchDraftExists();
    const serverHas = Boolean(latest?.result?.is_present);
    const serverId = latest?.result?.draft_id ?? null;

    // 1) 서버 드래프트 없음 → 바로 POST
    if (!serverHas) {
      const payload = buildDraftPayload();
      postDraft(
        { teamId, data: payload },
        {
          onSuccess: res => {
            setDraftId(res.result.inquiry_id);
            setHasActivatedDraft(true); // 이후부터 PUT
            markSaved({
              title,
              content,
              assigneeIds,
              referenceIds,
              fileIds,
            });
          },
        }
      );
      return;
    }

    // 2) 서버 드래프트 있음 + 아직 활성화 전 → 모달 오픈
    if (!hasActivatedDraft) {
      setIsDraftModalOpen(true);
      // 드래프트 id 동기화
      if (serverId != null) setDraftId(serverId);
      return;
    }

    // 3) 이미 활성화됨 → PUT
    const id = draftId ?? serverId;
    if (id == null) return;
    putDraft(
      { inquiryId: id, teamId, data: buildDraftPayload() },
      {
        onSuccess: () => {
          markSaved({
            title,
            content,
            assigneeIds,
            referenceIds,
            fileIds,
          });
        },
      }
    );
  };

  /** 모달: b. 불러오기 → get draft & 상태 세팅, 이후부터 PUT 고정 */
  const restoreDraft = async () => {
    setIsDraftModalOpen(false);

    const { data } = await fetchDraft();
    const r = data?.result as GetInquiryDraftResponse | undefined;
    if (!r) return;

    const restoredAssignees = r.assignees?.map(u => u.userId) ?? [];
    const restoredObservers = r.observers?.map(u => u.userId) ?? [];
    const restoredFiles = r.files ?? [];

    setTitle(r.title);
    setContent(r.content);
    setAssigneeIds(restoredAssignees);
    setReferenceIds(restoredObservers);
    setFileIds(restoredFiles.map(f => f.file_id));
    setFiles(
      restoredFiles.map(file => ({
        id: file.file_id,
        file_id: file.file_id,
        file_name: file.file_name,
        file_size: file.file_size,
        progress: 100,
        status: "done" as const,
      }))
    );

    handleGroupChange(r.group.group_id);
    handleDivisionChange(r.division.division_id);
    handleTeamChange(r.team.team_id);

    setDraftId(r.inquiry_id);
    setHasActivatedDraft(true); // 이후 PUT
    markSaved({
      title: r.title,
      content: r.content,
      assigneeIds: restoredAssignees,
      referenceIds: restoredObservers,
      fileIds: restoredFiles.map(f => f.file_id),
    });
  };

  /** 모달: a. 새로 작성 → delete draft + post draft, 이후부터 PUT 고정 */
  const resetDraft = async () => {
    if (!teamId) return;

    const { data: latest } = await refetchDraftExists();
    const serverId = latest?.result?.draft_id ?? draftId;

    const afterPost = () => {
      setHasActivatedDraft(true);
      markSaved({
        title,
        content,
        assigneeIds,
        referenceIds,
        fileIds,
      });
      setIsDraftModalOpen(false);
    };

    const doPost = () => {
      postDraft(
        { teamId, data: buildDraftPayload() },
        {
          onSuccess: res => {
            setDraftId(res.result.inquiry_id);
            afterPost();
          },
        }
      );
    };

    if (serverId) {
      deleteDraft(
        { inquiryId: serverId, teamId },
        {
          onSuccess: () => doPost(),
        }
      );
    } else {
      doPost();
    }
  };

  /** 최종 등록 전: 임시저장 삭제 helper (delete draft + then callback) */
  const deleteDraftBeforeSubmit = (onDone?: () => void) => {
    if (!teamId || !draftId) {
      onDone?.();
      return;
    }
    deleteDraft(
      { inquiryId: draftId, teamId },
      {
        onSuccess: () => {
          onDone?.();
        },
        onError: () => {
          // 실패해도 등록은 진행할 수 있게 콜백 실행은 해줌 (정책에 맞게 조정)
          onDone?.();
        },
      }
    );
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

    // 버튼 동작
    handleClickTempSave, // 임시저장 버튼 onClick에 연결

    // 모달 액션
    restoreDraft, // 불러오기
    resetDraft, // 새로 작성

    // 최종 등록 전 삭제용
    deleteDraftBeforeSubmit,

    clearDraftState,
  };
};
