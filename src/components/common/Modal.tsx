import React from "react";

import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  singleButton?: boolean;
  BlueText: string;
  WhiteText?: string;
  RightButtonType?: "blue" | "white" | "gray";
  LeftButtonType?: "blue" | "white" | "gray";
}

const getButtonClass = (
  type: "blue" | "white" | "gray",
  isSingle: boolean
): string => {
  const baseFlex =
    "flex justify-center items-center gap-4 flex-shrink-0 rounded-[15px] font-[ABeeZee] font-normal text-[20px] leading-[120%] cursor-pointer transition-colors duration-200";

  if (type === "blue") {
    return isSingle
      ? `${baseFlex} w-[280px] h-[64px] bg-main text-white hover:bg-main-dark`
      : `${baseFlex} w-[200px] h-[64px] bg-main text-white hover:bg-main-dark`;
  }
  if (type === "white") {
    return `${baseFlex} w-[200px] h-[64px] border border-main text-main bg-white hover:bg-gray-10`;
  }
  if (type === "gray") {
    return `${baseFlex} w-[200px] h-[64px] text-gray-700 bg-gray-30 hover:bg-gray-50 border border-transparent`;
  }
  return "";
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  singleButton = false,
  BlueText,
  WhiteText,
  RightButtonType = "blue",
  LeftButtonType = "white",
}) => {
  if (!isOpen) return null;

  const modalStyle = singleButton
    ? {
        width: "552px",
        height: "240px",
        padding: "48px 64px 40px 64px",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
        borderRadius: "15px",
        background: "var(--color-white)",
        zIndex: 1001,
      }
    : {
        width: "522px",
        height: "298px",
        padding: "48px 64px 40px 64px",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
        borderRadius: "15px",
        background: "var(--color-white)",
        zIndex: 1001,
      };

  return ReactDOM.createPortal(
    <>
      {/* 배경 클릭으로도 닫히게 */}
      <div
        className="fixed inset-0 z-50"
        onClick={onClose}
        style={{ pointerEvents: "auto" }}
      />

      {/* 모달 박스 */}
      <div
        style={modalStyle}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="text-center">
          <h2
            className="text-[24px] leading-[120%] font-normal font-[ABeeZee] text-center
             line-clamp-2 break-words max-h-[2.4em] overflow-hidden"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-[16px] text-gray-60 leading-[150%] max-w-[400px] mx-auto break-words line-clamp-2 overflow-hidden">
              {description}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-6 w-full">
          {singleButton ? (
            <button
              onClick={onClose}
              type="button"
              className={getButtonClass(RightButtonType, true)}
            >
              {BlueText}
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                type="button"
                className={getButtonClass(LeftButtonType, false)}
              >
                {WhiteText}
              </button>
              <button
                onClick={onConfirm}
                type="button"
                className={getButtonClass(RightButtonType, false)}
              >
                {BlueText}
              </button>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default Modal;
