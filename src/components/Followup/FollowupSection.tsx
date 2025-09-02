import { useMemo, useState } from "react";

import clsx from "clsx";

import FollowupForm from "@/components/Followup/FollowupForm";
import FollowupHeader from "@/components/Followup/FollowupHeader";
import FollowupThread from "@/components/Followup/FollowupThread";
import InquiryLeaveModal from "@/components/inquiry/common/InquiryLeaveModal";
import { useLeaveGuard } from "@/hooks/inquiry/useLeaveGuard";
import { InquiryData } from "@/types/inquiryTypes";

type Props = { inquiry: InquiryData };
type PendingAction = "none" | "local-close" | "edit-close";

const FollowupSection = ({ inquiry }: Props) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [, setPending] = useState<PendingAction>("none");
  const [, setPendingEditId] = useState<number | null>(null);

  const hasFollowups = (inquiry.follow_ups?.count ?? 0) > 0;
  const hasGap = isChatOpen || hasFollowups;

  const keyPrefix = useMemo(
    () => `followup:${inquiry.inquiry_id}:`,
    [inquiry.inquiry_id]
  );

  const snapshot = useMemo(
    () => ({ inquiryId: inquiry.inquiry_id, isChatOpen }),
    [inquiry.inquiry_id, isChatOpen]
  );

  const { modalProps, tryLeave, runWithBypass } = useLeaveGuard(snapshot, {
    enabled: true,
    initializeClean: true,
    beforeUnload: true,
    eventPrefixes: [keyPrefix],
    routerBlock: true,
  });

  const requestLocalClose = () => {
    tryLeave(() => setIsChatOpen(false));
    setPending("local-close");
  };

  const handleToggleChat = () => {
    if (isChatOpen) {
      requestLocalClose();
    } else {
      setIsChatOpen(true);
    }
  };

  const requestEditClose = (followupId: number) => {
    setPending("edit-close");
    setPendingEditId(followupId);
    tryLeave(() => {
      window.dispatchEvent(
        new CustomEvent("followup:close-edit", {
          detail: { followupId },
        })
      );
      setPendingEditId(null);
      setPending("none");
    });
  };

  const handleSubmittedClose = () => {
    runWithBypass(() => {
      setIsChatOpen(false);
    });
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
          onSubmitSuccess={() => {
            window.dispatchEvent(
              new CustomEvent("followup:dirty", {
                detail: { dirty: false, key: `${keyPrefix}new` },
              })
            );
          }}
          onSubmittedClose={handleSubmittedClose}
        />
      )}

      <FollowupThread
        inquiryId={inquiry.inquiry_id}
        assignees={inquiry.assignees}
        follow_ups={inquiry.follow_ups.follow_ups}
        onRequestEditClose={requestEditClose}
      />

      <InquiryLeaveModal {...modalProps} />
    </div>
  );
};

export default FollowupSection;
