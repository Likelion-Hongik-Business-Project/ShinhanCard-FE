import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { useBlocker } from "react-router-dom";

import FollowupForm from "@/components/Followup/FollowupForm";
import FollowupHeader from "@/components/Followup/FollowupHeader";
import FollowupThread from "@/components/Followup/FollowupThread";
import InquiryLeaveModal from "@/components/inquiry/common/InquiryLeaveModal";
import { InquiryData } from "@/types/inquiryTypes";

type Props = { inquiry: InquiryData };
type PendingAction = "none" | "local-close" | "route" | "edit-close";

const FollowupSection = ({ inquiry }: Props) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const hasFollowups = (inquiry.follow_ups?.count ?? 0) > 0;
  const hasGap = isChatOpen || hasFollowups;

  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [pending, setPending] = useState<PendingAction>("none");
  const [pendingEditId, setPendingEditId] = useState<number | null>(null);
  const blockerRef = useRef<ReturnType<typeof useBlocker> | null>(null);

  const dirtyKeysRef = useRef<Set<string>>(new Set());
  const [, forceRender] = useState(0);

  // 제출로 인한 닫기는 가드 완전 우회
  const bypassRef = useRef(false);

  // ===== 더티 이벤트 구독 =====
  useEffect(() => {
    const onDirty = (e: Event) => {
      const ce = e as CustomEvent<{ dirty: boolean; key?: string }>;
      const key = ce.detail?.key;
      if (!key) return;

      const set = dirtyKeysRef.current;
      let changed = false;

      if (ce.detail?.dirty) {
        if (!set.has(key)) {
          set.add(key);
          changed = true;
        }
      } else {
        if (set.has(key)) {
          set.delete(key);
          changed = true;
        }
      }

      if (changed) {
        // size 변동 시에만 리렌더
        forceRender(n => n + 1);
      }
    };

    window.addEventListener("followup:dirty", onDirty);
    return () => window.removeEventListener("followup:dirty", onDirty);
  }, []);

  // 가드 활성 조건: 로컬 폼 열림 or 외부(어디든) 더티, 그리고 우회 아님
  const guardActive =
    (isChatOpen || dirtyKeysRef.current.size > 0) && !bypassRef.current;

  // 최신 가드 상태를 핸들러에서 읽기 위한 ref
  const guardActiveRef = useRef(guardActive);
  guardActiveRef.current = guardActive;

  // 라우팅 이탈 차단
  const blocker = useBlocker(guardActive);
  blockerRef.current = blocker;

  useEffect(() => {
    if (blocker.state === "blocked" && !bypassRef.current) {
      setPending("route");
      setIsLeaveOpen(true);
    }
  }, [blocker.state]);

  // beforeunload는 항상 1회 등록, 동작 여부만 ref로 제어
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (guardActiveRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // ===== 편집 폼 닫기 요청(가드 경유) =====
  const requestEditClose = (followupId: number) => {
    const key = `followup:edit:${followupId}`;
    const isDirty = dirtyKeysRef.current.has(key);

    if (isDirty) {
      setPendingEditId(followupId);
      setPending("edit-close");
      setIsLeaveOpen(true);
    } else {
      // 더티 아님 → 바로 닫기 이벤트
      window.dispatchEvent(
        new CustomEvent("followup:close-edit", { detail: { followupId } })
      );
    }
  };

  const requestLocalClose = () => {
    if (!isChatOpen) {
      setIsChatOpen(false);
      return;
    }
    setPending("local-close");
    setIsLeaveOpen(true);
  };

  const handleToggleChat = () => {
    if (isChatOpen) {
      requestLocalClose();
    } else {
      bypassRef.current = false;
      setIsChatOpen(true);
    }
  };

  const handleConfirmLeave = () => {
    setIsLeaveOpen(false);

    if (pending === "route") {
      blockerRef.current?.proceed?.();
    } else if (pending === "local-close") {
      setIsChatOpen(false);
    } else if (pending === "edit-close" && pendingEditId != null) {
      window.dispatchEvent(
        new CustomEvent("followup:close-edit", {
          detail: { followupId: pendingEditId },
        })
      );
      setPendingEditId(null);
    }

    setPending("none");
    bypassRef.current = false;
  };

  const handleCancelLeave = () => {
    setIsLeaveOpen(false);
    if (pending === "route") blockerRef.current?.reset?.();
    setPending("none");
    setPendingEditId(null);
    bypassRef.current = false;
  };

  return (
    <div
      className={clsx(
        "w-full max-w-[1420px] rounded-[15px] py-14 px-16 bg-white flex flex-col",
        hasGap ? "gap-8" : "gap-0"
      )}
    >
      <FollowupHeader
        follow_ups_cnt={inquiry.follow_ups?.count ?? 0}
        isChatOpen={isChatOpen}
        onClick={handleToggleChat}
      />

      {isChatOpen && (
        <FollowupForm
          inquiryId={inquiry.inquiry_id}
          assignees={inquiry.assignees}
          onClose={requestLocalClose}
          onSubmitSuccess={() => {}}
          onSubmittedClose={() => {
            bypassRef.current = true;
            setIsChatOpen(false);
          }}
        />
      )}

      <FollowupThread
        inquiryId={inquiry.inquiry_id}
        assignees={inquiry.assignees}
        follow_ups={inquiry.follow_ups.follow_ups}
        onRequestEditClose={requestEditClose}
      />

      <InquiryLeaveModal
        isOpen={isLeaveOpen}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
    </div>
  );
};

export default FollowupSection;
