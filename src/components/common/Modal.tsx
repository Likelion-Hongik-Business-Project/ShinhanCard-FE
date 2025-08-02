import ReactDOM from "react-dom";

interface ModalButton {
  type: "blue" | "white" | "gray";
  label: string;
  onClick: () => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttons: ModalButton[];
}

const getButtonClass = (
  type: ModalButton["type"],
  isSingle: boolean
): string => {
  const widthClass = isSingle ? "w-[280px]" : "w-[200px]";
  const base = `flex justify-center items-center gap-4 rounded-[15px] text-heading3 cursor-pointer ${widthClass} h-16 transition-colors duration-200`;

  switch (type) {
    case "blue":
      return `${base} bg-main text-white hover:bg-main-dark hover:text-gray-30`;
    case "white":
      return `${base} bg-white border border-main text-main hover:bg-gray-10`;
    case "gray":
      return `${base} bg-gray-30 text-white hover:bg-gray-50`;
  }
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  buttons,
}: ModalProps) => {
  if (!isOpen) return null;

  const isSingle = buttons.length === 1;
  const modalHeight = isSingle ? "h-[240px]" : "h-[298px]";

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 bg-background-default z-50"
        onClick={onClose}
      />

      <div
        className={`fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[552px] ${modalHeight} px-16 pt-12 pb-10 bg-white rounded-[15px] flex flex-col items-center justify-between`}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-heading2-b text-gray-80 break-words">{title}</h2>
          {description && (
            <div className="mt-4 h-12 flex items-center max-w-[400px]">
              <p className="text-body2 text-gray-60 mx-auto">{description}</p>
            </div>
          )}
        </div>

        <div className={`flex justify-center gap-6 w-full`}>
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={getButtonClass(btn.type, isSingle)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body
  );
};

export default Modal;
