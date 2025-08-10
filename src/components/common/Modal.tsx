import { useEffect } from "react";

import ReactDOM from "react-dom";

import { getButtonClass } from "@/utils/modalUtils";
import { ModalButton } from "@/types/modal";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttons: ModalButton[];
}

const Modal = ({ isOpen, onClose, title, description, buttons }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isSingle = buttons.length === 1;
  const modalHeight = isSingle ? "h-[240px]" : "h-[298px]";

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 bg-background-default z-[999]"
        onClick={onClose}
      />

      <div
        className={`fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
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
