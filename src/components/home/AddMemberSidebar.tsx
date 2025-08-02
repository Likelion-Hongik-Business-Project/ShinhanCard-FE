import clsx from "clsx";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
};

const AddMemberSidebar = ({ isOpen, onClose }: Props) => {
  //const id = "2" // TODO: 팀 아이디 동적으로 가져오는 로직으로 변경

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-40 transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      >
        <div className="absolute inset-0" />
      </div>

      <aside
        className={clsx(
          "fixed top-16 right-0 h-[calc(100vh-64px)] bg-white z-50 transition-transform duration-300 w-88 px-8 py-10 overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full h-full flex items-center justify-center">
          팀원 검색 사이드바
        </div>
      </aside>
    </>
  );
};

export default AddMemberSidebar;
