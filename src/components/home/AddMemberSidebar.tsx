// src/components/Home/AddMemberSidebar.tsx
import clsx from "clsx";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
};

const AddMemberSidebar = ({ isOpen, onClose }: Props) => {
  //const id = "2" // TODO: 팀 아이디 동적으로 가져오는 로직으로 변경

  return (
    <>
      {/* 오버레이: 사이드바가 열릴 때만 보임 */}
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
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.2)" }}
        />
      </div>

      {/* 사이드바: 항상 렌더링, 트랜지션 적용 */}
      <aside
        className={clsx(
          "fixed top-16 right-0 h-[calc(100vh-64px)] bg-white z-50 transition-transform duration-300 w-88 shadow-lg",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ overflow: "hidden" }}
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
