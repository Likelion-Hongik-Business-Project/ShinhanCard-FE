import { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import InboxList from "@/components/inbox/InboxList";
import InboxTabs from "@/components/inbox/InboxTabs";
import { useOutsideClick } from "@/hooks/common/useOutsideClick";
import {
  useArchivedNotificationsInfinite,
  useNotificationsInfinite,
  useUnreadCount,
} from "@/hooks/inbox/useInboxApi";
import { Tab } from "@/types/inbox/inbox.type";

type Props = {
  isSidebarOpen: boolean;
  isOpen: boolean;
  onClose: () => void;
  triggerRefs: React.RefObject<HTMLLIElement | null>[];
};

const Inbox = ({ isSidebarOpen, isOpen, onClose, triggerRefs }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLUListElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick([ref, ...triggerRefs], onClose);

  const [selectedTab, setSelectedTab] = useState<Tab>("전체");
  const isArchiveTab = selectedTab === "보관함";

  // 수신함 인피니트
  const {
    data: inboxInfinite,
    fetchNextPage: fetchNextInbox,
    hasNextPage: hasNextInbox,
    isFetchingNextPage: fetchingNextInbox,
  } = useNotificationsInfinite(!isArchiveTab);

  // 보관함 인피니트
  const {
    data: archiveInfinite,
    fetchNextPage: fetchNextArchive,
    hasNextPage: hasNextArchive,
    isFetchingNextPage: fetchingNextArchive,
  } = useArchivedNotificationsInfinite(isArchiveTab);

  const items = isArchiveTab
    ? (archiveInfinite?.items ?? [])
    : (inboxInfinite?.items ?? []);

  const unread = useUnreadCount();
  const badgeText = unread > 99 ? "99+" : `${unread}`;

  const hasNextPage = isArchiveTab ? hasNextArchive : hasNextInbox;
  const isFetchingNextPage = isArchiveTab
    ? fetchingNextArchive
    : fetchingNextInbox;
  const fetchNextPage = isArchiveTab ? fetchNextArchive : fetchNextInbox;

  // IO: 스크롤 컨테이너(ul)를 root로 (sentinel)
  useEffect(() => {
    const rootEl = scrollRef.current;
    const target = loadMoreRef.current;
    if (!rootEl || !target) return;

    const io = new IntersectionObserver(
      entries => {
        if (
          entries.some(e => e.isIntersecting) &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      {
        root: rootEl,
        rootMargin: "0px 0px 200px 0px",
        threshold: 0.1,
      }
    );
    io.observe(target);
    return () => io.disconnect();
  }, [
    isArchiveTab,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    items.length,
  ]);

  return (
    <aside
      ref={ref}
      className={clsx(
        "fixed top-16 px-8 pt-[52px] w-[560px] h-[calc(100vh-64px)] bg-white border-x border-gray-20 z-100 transition-all duration-300",
        isSidebarOpen ? "left-[320px]" : "left-[100px]",
        isOpen
          ? "opacity-100 translate-x-0 duration-300 pointer-events-auto delay-100"
          : "opacity-0 -translate-x-2 duration-200 pointer-events-none delay-0"
      )}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-6">
        <p className="text-heading1 text-gray-80">수신함</p>
        <div className="px-4 py-1 bg-main rounded-[30px] h-[30px] flex justify-center items-center">
          <span className=" text-white text-body1">{badgeText}</span>
        </div>
      </div>

      {/* 탭 */}
      <InboxTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

      {/* 탭별 데이터 렌더링 */}
      <InboxList
        inquiries={items}
        tab={isArchiveTab ? "보관함" : "전체"}
        listRef={scrollRef}
        loadMoreRef={loadMoreRef}
      />
    </aside>
  );
};

export default Inbox;
