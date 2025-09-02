// src/hooks/inquiry/useLeaveGuard.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useBlocker } from "react-router-dom";

interface UseLeaveGuardOptions {
  enabled?: boolean;
  initializeClean?: boolean;
  beforeUnload?: boolean;
  /** followup:dirty 이벤트의 key prefix 목록. 예: ['answer:', 'followup:'] */
  eventPrefixes?: string[];
  /** 라우터 네비게이션 차단을 이 훅에서 할지 여부 (페이지 단 하나만 true로!) */
  routerBlock?: boolean;
}

type DirtyEventDetail = {
  dirty: boolean;
  key?: string;
  reason?: string;
};

type SnapshotJson = string;

// react-router의 useBlocker 반환 타입을 그대로 사용
type BlockerApi = ReturnType<typeof useBlocker>;

/** 안정적인 stringify (키 정렬 + 순환참조 보호) */
function stableStringify(value: unknown): SnapshotJson {
  const seen = new WeakSet<object>();

  const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const helper = (v: unknown): unknown => {
    if (isObject(v)) {
      if (seen.has(v)) return "[Circular]";
      seen.add(v);

      if (Array.isArray(v)) {
        return v.map(helper);
      }

      const sortedKeys = Object.keys(v).sort();
      const out: Record<string, unknown> = {};
      for (const k of sortedKeys) {
        const val = v[k];
        if (typeof val === "function" || typeof val === "symbol") continue;
        out[k] = helper(val);
      }
      return out;
    }
    return v;
  };

  return JSON.stringify(helper(value));
}

export function useLeaveGuard<T extends object>(
  snapshot: T,
  options: UseLeaveGuardOptions = {}
) {
  const {
    enabled = true,
    initializeClean = false,
    beforeUnload = true,
    eventPrefixes,
    routerBlock = true,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const baselineRef = useRef<SnapshotJson>("");

  const blockerRef = useRef<BlockerApi | null>(null);
  const bypassRef = useRef<boolean>(false);

  // 최신 enabled를 핸들러에서 읽기 위한 ref
  const enabledRef = useRef<boolean>(enabled);
  enabledRef.current = enabled;

  const flat = useMemo<SnapshotJson>(
    () => stableStringify(snapshot),
    [snapshot]
  );

  // --- 스냅샷 기반 더티 ---
  useEffect(() => {
    if (initializeClean && !baselineRef.current) {
      baselineRef.current = flat;
    }
  }, [initializeClean, flat]);

  const snapshotDirty =
    enabled && baselineRef.current !== "" && flat !== baselineRef.current;

  // 스냅샷 더티의 "동기 접근"을 위한 ref
  const snapshotDirtyRef = useRef<boolean>(false);
  useEffect(() => {
    snapshotDirtyRef.current = snapshotDirty;
  }, [snapshotDirty]);

  // --- 이벤트 기반 더티 (followup:dirty) ---
  const [eventDirty, setEventDirty] = useState<boolean>(false);
  const eventDirtyRef = useRef<boolean>(false); // 동기 접근용
  useEffect(() => {
    if (!eventPrefixes || eventPrefixes.length === 0) return;

    const onDirty = (e: Event) => {
      const ce = e as CustomEvent<DirtyEventDetail>;
      const key = ce.detail?.key ?? "";
      const match = eventPrefixes.some(p => key.startsWith(p));
      if (!match) return;

      const next = Boolean(ce.detail?.dirty);
      eventDirtyRef.current = next; // 즉시 반영
      setEventDirty(next); // 렌더 반영
    };

    window.addEventListener("followup:dirty", onDirty);
    return () => window.removeEventListener("followup:dirty", onDirty);
  }, [eventPrefixes]);

  // 렌더에서 쓰는 유효 더티 (라우팅 차단용)
  const effectiveDirty = snapshotDirty || eventDirty;

  // beforeunload / tryLeave에서 즉시 쓰는 유효 더티 (ref)
  const getEffectiveDirtyNow = () =>
    snapshotDirtyRef.current || eventDirtyRef.current;

  // 라우팅 차단 (페이지 단 하나의 훅만 routerBlock=true 여야 함)
  const blocker = useBlocker(
    routerBlock && enabled && !bypassRef.current && effectiveDirty
  );

  useEffect(() => {
    if (!routerBlock) return;
    blockerRef.current = blocker;
    if (blocker.state === "blocked") setIsOpen(true);
  }, [blocker, routerBlock]);

  // 로컬 액션 지연 실행 저장소
  const deferredRef = useRef<null | (() => void)>(null);

  // 확인: 라우팅이면 proceed, 로컬이면 지연된 액션을 우회 실행
  const confirmLeave = useCallback(() => {
    const blocked =
      routerBlock &&
      blockerRef.current !== null &&
      blockerRef.current.state === "blocked";

    setIsOpen(false);

    if (blocked) {
      blockerRef.current?.proceed?.();
      return;
    }

    const run = deferredRef.current;
    deferredRef.current = null;

    if (run) {
      bypassRef.current = true;
      try {
        run();
      } finally {
        bypassRef.current = false;
      }
    }
  }, [routerBlock]);

  const cancelLeave = useCallback(() => {
    const blocked =
      routerBlock &&
      blockerRef.current !== null &&
      blockerRef.current.state === "blocked";

    setIsOpen(false);
    if (blocked) blockerRef.current?.reset?.();
    deferredRef.current = null;
  }, [routerBlock]);

  // beforeunload: 항상 1회 등록, 동작 여부는 ref로 판단
  useEffect(() => {
    if (!beforeUnload) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (enabledRef.current && !bypassRef.current && getEffectiveDirtyNow()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [beforeUnload]);

  const setClean = useCallback(() => {
    baselineRef.current = flat;
    eventDirtyRef.current = false;
    setEventDirty(false);
  }, [flat]);

  const setBaseline = useCallback((nextSnapshot: T) => {
    baselineRef.current = stableStringify(nextSnapshot);
    eventDirtyRef.current = false;
    setEventDirty(false);
  }, []);

  const runWithBypass = useCallback(
    async <TOut>(fn: () => Promise<TOut> | TOut) => {
      bypassRef.current = true;
      try {
        return await fn();
      } finally {
        bypassRef.current = false;
      }
    },
    []
  );

  // 로컬 액션 가드: 더티면 모달을 띄우고, 아니면 즉시 실행
  const tryLeave = useCallback((action: () => void) => {
    if (!enabledRef.current) {
      action();
      return;
    }
    if (getEffectiveDirtyNow()) {
      deferredRef.current = action;
      setIsOpen(true);
    } else {
      action();
    }
  }, []);

  return {
    isOpen,
    isDirty: effectiveDirty,
    confirmLeave,
    cancelLeave,
    modalProps: { isOpen, onConfirm: confirmLeave, onCancel: cancelLeave },
    setClean,
    setBaseline,
    runWithBypass,
    tryLeave,
    bypassRef,
  };
}
