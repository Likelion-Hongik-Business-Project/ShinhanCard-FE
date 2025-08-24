import { useEffect, useMemo, useRef, useState } from "react";

import { useBlocker } from "react-router-dom";

/**
 * options:
 *   - enabled: 이탈 감지 활성화 여부 (기본 true)
 *   - initializeClean: 마운트 시점에 현재 snapshot을 baseline으로 잡을지(기본 false)
 *   - beforeUnload: 새로고침/창닫기 차단 활성화(기본 true)
 */
interface UseLeaveGuardOptions {
  enabled?: boolean;
  initializeClean?: boolean;
  beforeUnload?: boolean;
}

export function useLeaveGuard<T extends object>(
  snapshot: T,
  options: UseLeaveGuardOptions = {}
) {
  const {
    enabled = true,
    initializeClean = false,
    beforeUnload = true,
  } = options;

  // baseline(초기 스냅샷)과 현재 snapshot 비교로 dirty 판단
  const [isOpen, setIsOpen] = useState(false);
  const baselineRef = useRef<string>("");
  const blockerRef = useRef<ReturnType<typeof useBlocker> | null>(null);
  const bypassRef = useRef(false); // 특정 시점(제출/의도적 이동)에는 가드 잠시 무시

  // 문자열 스냅샷(안정 비교용)
  const flat = useMemo(() => JSON.stringify(snapshot), [snapshot]);

  // 필요 시(편집 데이터 주입 완료 직후 등) 초기 baseline을 현재로 설정
  useEffect(() => {
    if (initializeClean && !baselineRef.current) {
      baselineRef.current = flat;
    }
  }, [initializeClean, flat]);

  const isDirty =
    enabled && baselineRef.current !== "" && flat !== baselineRef.current;

  // 내부 라우팅 차단
  const blocker = useBlocker(enabled && !bypassRef.current && isDirty);

  useEffect(() => {
    blockerRef.current = blocker;
    if (blocker.state === "blocked") {
      setIsOpen(true);
    }
  }, [blocker]);

  const confirmLeave = () => {
    blockerRef.current?.proceed?.();
    setIsOpen(false);
  };

  const cancelLeave = () => {
    blockerRef.current?.reset?.();
    setIsOpen(false);
  };

  // 새로고침/탭닫기 차단
  useEffect(() => {
    if (!beforeUnload) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty, beforeUnload]);

  // 제출 성공 등, 현재 상태를 "깨끗한 상태"로 간주하고 싶을 때 호출
  const setClean = () => {
    baselineRef.current = flat;
  };

  // 외부에서 임의로 baseline을 특정 상태로 맞추고 싶을 때
  const setBaseline = (nextSnapshot: T) => {
    baselineRef.current = JSON.stringify(nextSnapshot);
  };

  // 어떤 동작을 수행하는 동안에는 가드를 잠시 비활성화
  // 예: 의도적 라우팅, 제출 직후 이동 등
  async function runWithBypass<TOut>(fn: () => Promise<TOut> | TOut) {
    bypassRef.current = true;
    try {
      const r = await fn();
      return r;
    } finally {
      bypassRef.current = false;
    }
  }

  return {
    // 상태
    isOpen,
    isDirty,

    // 모달 핸들러
    confirmLeave,
    cancelLeave,

    // 모달에 바로 바인딩할 props
    modalProps: {
      isOpen,
      onConfirm: confirmLeave,
      onCancel: cancelLeave,
    },

    // 베이스라인/우회 도구
    setClean,
    setBaseline,
    runWithBypass,
  };
}
