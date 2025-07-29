import clsx from "clsx";

type Props = {
  isSidebarOpen: boolean;
};

const Inbox = ({ isSidebarOpen }: Props) => {
  return (
    <div
      className={clsx(
        "fixed top-16 w-[560px] h-[calc(100vh-64px)] bg-white border-x border-gray-20 z-100 transition-all",
        isSidebarOpen ? "left-[320px]" : "left-[100px]"
      )}
    >
      <p className="text-heading1 text-gray-80 px-9 pt-[52px]">수신함</p>
    </div>
  );
};

export default Inbox;
