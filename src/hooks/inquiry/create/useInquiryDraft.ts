import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import { useInquiryDraftApi } from "@/hooks/inquiry/create/useInquiryDraftApi";
import { UploadFile } from "@/types/file/file.type";
import { GetInquiryDraftResponse } from "@/types/inquiry/inquiryDraftApi.type";

export interface UseInquiryDraftParams {
  teamId: number;
  title: string;
  content: string;
  assigneeIds: number[];
  referenceIds: number[];
  fileIds: number[]; // 외부 상태(백업 소스)
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  setAssigneeIds: (v: number[]) => void;
  setReferenceIds: (v: number[]) => void;
  setFileIds: (v: number[]) => void;
  setFiles: Dispatch<SetStateAction<UploadFile[]>>;

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
  const as = [...a].sort((x, y) => x - y);
  const bs = [...b].sort((x, y) => x - y);
  for (let i = 0; i < as.length; i++) if (as[i] !== bs[i]) return false;
  return true;
};

const toNum = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? (n as number) : NaN;
};

export const useInquiryDraft = ({
  teamId,
  title,
  content,
  assigneeIds,
  referenceIds,
  fileIds, // 외부 state(보조 소스)
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
  const [hasActivatedDraft, setHasActivatedDraft] = useState(false);

  const [draftModalMode, setDraftModalMode] = useState<"detect" | "conflict">(
    "detect"
  );
  const autoOpenSuppressedRef = useRef(false);
  const lastServerDraftIdRef = useRef<number | null>(null);

  // 변경 감지 기준
  const prevRef = useRef({
    title,
    content,
    assigneeIds,
    referenceIds,
    fileIds,
  });

  // 업로드 파일 스냅샷
  const filesRef = useRef<UploadFile[]>([]);

  const setFilesSync: Dispatch<SetStateAction<UploadFile[]>> = next => {
    const resolved =
      typeof next === "function"
        ? (next as (prev: UploadFile[]) => UploadFile[])(filesRef.current)
        : next;

    filesRef.current = resolved;
    setFiles(resolved);

    // ref에서 완료된 file_id 수집
    const fromRef = resolved
      .filter(
        f =>
          f.status === "done" &&
          f.file_id != null &&
          !Number.isNaN(toNum(f.file_id))
      )
      .map(f => toNum(f.file_id));

    // 외부 상태와 병합 뒤 dedup
    const merged = Array.from(
      new Set([
        ...fromRef,
        ...((fileIds ?? []).filter(
          n => Number.isFinite(n) && n > 0
        ) as number[]),
      ])
    );

    if (!arrEq(fileIds, merged)) setFileIds(merged);
  };

  const getHasUploading = () =>
    filesRef.current.some(f => f.status === "uploading");

  // filesRef + 외부 state 병합하여 안전한 파일 ID 도출
  const getSafeFileIds = () => {
    const fromRef = filesRef.current
      .filter(
        f =>
          f.status === "done" &&
          f.file_id != null &&
          !Number.isNaN(toNum(f.file_id))
      )
      .map(f => toNum(f.file_id));
    const fromState = (fileIds ?? []).filter(
      (n): n is number => Number.isFinite(n) && n > 0
    );
    return Array.from(new Set([...fromRef, ...fromState]));
  };

  const {
    useCheckDraftExists,
    usePostInquiryDraftMutation,
    useGetInquiryDraft,
    useDeleteInquiryDraftMutation,
    usePutInquiryDraftMutation,
  } = useInquiryDraftApi();

  const {
    data: draftExists,
    refetch: refetchDraftExists,
    isLoading: isExistsLoading,
    isFetching: isExistsFetching,
    isSuccess: isExistsSuccess,
  } = useCheckDraftExists(teamId, !!teamId);

  const { refetch: fetchDraft } = useGetInquiryDraft(
    teamId,
    draftExists?.result?.draft_id ?? 0,
    !!teamId && !!draftExists?.result?.draft_id
  );

  const { mutate: postDraft } = usePostInquiryDraftMutation();
  const { mutate: putDraft } = usePutInquiryDraftMutation();
  const { mutate: deleteDraft } = useDeleteInquiryDraftMutation();

  // 팀 변경 시 자동오픈 억제 해제
  useEffect(() => {
    autoOpenSuppressedRef.current = false;
  }, [teamId]);

  // 서버 초안 존재 시 자동 오픈
  useEffect(() => {
    if (!teamId) return;
    if (hasActivatedDraft || isDraftModalOpen) return;
    if (!isExistsSuccess || isExistsLoading || isExistsFetching) return;

    if (draftExists?.result?.is_present && !autoOpenSuppressedRef.current) {
      lastServerDraftIdRef.current = draftExists.result.draft_id;
      setDraftModalMode("detect");
      setIsDraftModalOpen(true);
    }
  }, [
    teamId,
    hasActivatedDraft,
    isDraftModalOpen,
    isExistsSuccess,
    isExistsLoading,
    isExistsFetching,
    draftExists?.result?.is_present,
    draftExists?.result?.draft_id,
  ]);

  // 팀 변경 시 상태 리셋 및 기준 스냅샷 갱신
  useEffect(() => {
    if (!teamId) return;

    setDraftId(null);
    setHasActivatedDraft(false);
    setIsDraftSaved(false);
    setJustSavedDraft(false);
    setDraftModalMode("detect");
    autoOpenSuppressedRef.current = false;

    prevRef.current = {
      title,
      content,
      assigneeIds,
      referenceIds,
      fileIds: getSafeFileIds(),
    };
  }, [teamId]);

  // 저장 후 변경 감지
  useEffect(() => {
    if (!isDraftSaved) return;

    const changed =
      prevRef.current.title !== title ||
      prevRef.current.content !== content ||
      !arrEq(prevRef.current.assigneeIds, assigneeIds) ||
      !arrEq(prevRef.current.referenceIds, referenceIds) ||
      !arrEq(prevRef.current.fileIds, getSafeFileIds());

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

  // payload는 항상 안전 파일 ID 사용
  const buildDraftPayload = () => ({
    title,
    content,
    assignee_ids: assigneeIds ?? [],
    observer_ids: referenceIds ?? [],
    file_ids: getSafeFileIds(),
  });

  /** 임시저장 버튼 */
  const handleClickTempSave = async () => {
    if (justSavedDraft) return;
    if (getHasUploading()) return;

    // 최신 서버 상태 조회
    const { data: latest } = await refetchDraftExists();
    const serverHas = Boolean(latest?.result?.is_present);
    const serverId = latest?.result?.draft_id ?? null;
    lastServerDraftIdRef.current = serverId;

    // 서버 초안 존재 + 아직 활성화 전 → 충돌 모달
    if (serverHas && !hasActivatedDraft) {
      setDraftModalMode("conflict");
      setIsDraftModalOpen(true);
      return;
    }

    // 필드 검증
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }

    // 서버 초안 없음 → POST
    if (!serverHas) {
      const payload = buildDraftPayload();
      postDraft(
        { teamId, data: payload },
        {
          onSuccess: res => {
            setDraftId(res.result.inquiry_id);
            setHasActivatedDraft(true);
            markSaved({
              title,
              content,
              assigneeIds,
              referenceIds,
              fileIds: payload.file_ids,
            });
          },
        }
      );
      return;
    }

    // 이미 활성화됨 → PUT
    const id = serverId ?? draftId;
    if (id == null) return;

    const payload = buildDraftPayload();
    putDraft(
      { inquiryId: id, teamId, data: payload },
      {
        onSuccess: () => {
          markSaved({
            title,
            content,
            assigneeIds,
            referenceIds,
            fileIds: payload.file_ids,
          });
        },
      }
    );
  };

  /** 충돌 모달: "현재 글 유지로 임시저장" (기존 초안 삭제 → 지금 글로 POST) */
  const saveCurrentAsDraftReplacingExisting = async () => {
    const serverId = lastServerDraftIdRef.current;

    const doPost = () => {
      const payload = buildDraftPayload();
      postDraft(
        { teamId, data: payload },
        {
          onSuccess: res => {
            setDraftId(res.result.inquiry_id);
            setHasActivatedDraft(true);
            markSaved({
              title,
              content,
              assigneeIds,
              referenceIds,
              fileIds: payload.file_ids,
            });
            setIsDraftModalOpen(false);
          },
        }
      );
    };

    if (serverId) {
      deleteDraft(
        { inquiryId: serverId, teamId },
        { onSuccess: doPost, onError: doPost }
      );
    } else {
      doPost();
    }
  };

  /** 모달: 불러오기 → 상태 세팅 후 PUT 고정 */
  const restoreDraft = async () => {
    setHasActivatedDraft(true);
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

    setFilesSync(
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
    markSaved({
      title: r.title,
      content: r.content,
      assigneeIds: restoredAssignees,
      referenceIds: restoredObservers,
      fileIds: Array.from(
        new Set(
          restoredFiles
            .map(f => toNum(f.file_id))
            .filter(n => Number.isFinite(n) && n > 0)
        )
      ),
    });
  };

  /** 모달: 현재 글 유지 → 팝업만 닫기 */
  const resetDraft = () => {
    autoOpenSuppressedRef.current = true;
    setIsDraftModalOpen(false);
  };

  /** 최종 등록 전: 임시저장 삭제 helper */
  const deleteDraftBeforeSubmit = (onDone?: () => void) => {
    if (!teamId || !draftId) {
      onDone?.();
      return;
    }
    deleteDraft(
      { inquiryId: draftId, teamId },
      {
        onSuccess: () => onDone?.(),
        onError: () => onDone?.(),
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

    draftModalMode, // "detect" | "conflict"

    // 버튼 동작
    handleClickTempSave,

    // 모달 액션
    restoreDraft,
    resetDraft,
    saveCurrentAsDraftReplacingExisting,

    deleteDraftBeforeSubmit,
    clearDraftState,

    // 파일
    setFilesSync,
    hasUploadingFiles: getHasUploading,
    getSafeFileIds,
  };
};
