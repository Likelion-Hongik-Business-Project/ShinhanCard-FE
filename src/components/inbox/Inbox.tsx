import { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import InboxList from "@/components/inbox/InboxList";
import InboxTabs from "@/components/inbox/InboxTabs";
import {
  useArchivedNotificationsApi,
  useNotificationsInfinite,
} from "@/hooks/inbox/useInboxApi";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Tab } from "@/types/inbox";

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

  // const {
  //   data: allData,
  //   isLoading: isAllLoading,
  //   isError: isAllError,
  // } = useNotificationsApi({ page: 0, page_size: 20 });

  const { data: archivedData } = useArchivedNotificationsApi({
    page: 0,
    page_size: 20,
  });

  // const allInquiries = allData?.notifications ?? [];
  // const unreadCount = allData?.unread_count ?? 0;
  const archivedInquiries = archivedData?.notifications ?? [];

  const {
    data: inboxInfinite,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotificationsInfinite(true);

  const items = inboxInfinite?.items ?? [];
  const unreadCount = inboxInfinite?.unread ?? 0;
  const badgeText = unreadCount > 99 ? "99+" : `${unreadCount}`;
  // sentinel
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
      {selectedTab === "보관함" ? (
        <InboxList inquiries={archivedInquiries} tab="보관함" />
      ) : (
        <>
          <InboxList
            inquiries={items}
            tab="전체"
            listRef={scrollRef}
            loadMoreRef={loadMoreRef}
          />
        </>
      )}
    </aside>
  );
};

export default Inbox;
