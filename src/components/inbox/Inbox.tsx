import { useRef } from "react";

import clsx from "clsx";

import { useOutsideClick } from "@/hooks/useOutsideClick";

type Props = {
  isSidebarOpen: boolean;
  isOpen: boolean;
  onClose: () => void;
};

const Inbox = ({ isSidebarOpen, isOpen, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClose);

  return (
    <div
      ref={ref}
      className={clsx(
        "fixed top-16 w-[560px] h-[calc(100vh-64px)] bg-white border-x border-gray-20 z-100 transition-all duration-300",
        isSidebarOpen ? "left-[320px]" : "left-[100px]",
        isOpen
          ? "opacity-100 translate-x-0 duration-300 pointer-events-auto delay-100"
          : "opacity-0 -translate-x-2 duration-200 pointer-events-none delay-0"
      )}
    >
      <p className="text-heading1 text-gray-80 px-9 pt-[52px]">수신함</p>
    </div>
  );
};

export default Inbox;
