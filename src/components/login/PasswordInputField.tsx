import { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import EyeOffIcon from "@/assets/svgs/login/eye-off.svg";
import EyeIcon from "@/assets/svgs/login/eye-on.svg";
import XMarkGrayIcon from "@/assets/svgs/login/x-mark-gray.svg";
import {
  BORDER_COLOR_MAP,
  InputStatus,
  LABEL_COLOR_MAP,
  PW_LABEL_TEXT,
} from "@/constants/login";

interface Props {
  value: string; // 입력값
  setValue: (v: string) => void; // 입력값 변경 함수
  errorTypePw?: "none" | "invalid"; // 오류 상태
}

const PasswordInputField = ({
  value,
  setValue,
  errorTypePw = "none",
}: Props) => {
  const [isFocused, setIsFocused] = useState(false); // 포커스 상태
  const [isHovered, setIsHovered] = useState(false); // 호버 상태
  const [visible, setVisible] = useState(false); // 비밀번호 보이기/숨기기
  const [cursorPos, setCursorPos] = useState<number | null>(null); // 커서 위치 기억

  const inputRef = useRef<HTMLInputElement>(null);
  const hasText = value.length > 0;

  /* label을 띄우는 조건 -> 텍스트가 입력된 상태, 포커스 상태 */
  const showLabel = isFocused || hasText || errorTypePw !== "none";

  // 상태 계산
  let status: InputStatus;

  if (errorTypePw === "invalid") {
    status = "error";
  } else if (isFocused) {
    status = "typing";
  } else if (hasText) {
    status = "done";
  } else {
    status = "default";
  }

  let actualStatus: InputStatus = status;
  if (status === "done" && isHovered) {
    actualStatus = "typing";
  }

  let borderColorClass = BORDER_COLOR_MAP[actualStatus];
  // 호버 시 파란색 border 적용
  if ((status === "done" || status === "default") && isHovered) {
    borderColorClass = BORDER_COLOR_MAP["typing"];
  }

  const labelColorClass = LABEL_COLOR_MAP[actualStatus];
  const labelText = PW_LABEL_TEXT[status] ?? "Password";

  /* 그림자 효과 - 포커스 상태일 때만 적용 */
  const showShadow = actualStatus === "typing" && !isHovered;

  const handleChange = (text: string) => setValue(text);

  /* 비밀번호 보기 토글 + 커서 위치 유지 */
  const handleEyeToggle = () => {
    const input = inputRef.current;
    if (!input) return;

    const pos = input.selectionStart ?? value.length;
    setCursorPos(pos);
    setVisible(prev => !prev);

    setTimeout(() => {
      const updatedInput = inputRef.current;
      if (updatedInput) {
        updatedInput.focus({ preventScroll: true });
        updatedInput.setSelectionRange(pos, pos);
      }
    }, 0);
  };

  /* 비밀번호 보기 상태 변경 시 커서 위치 복원 */
  useEffect(() => {
    const input = inputRef.current;
    if (input && cursorPos !== null) {
      input.focus({ preventScroll: true });
      input.setSelectionRange(cursorPos, cursorPos);
    }
  }, [visible]);

  return (
    <div
      className={clsx(
        "w-full bg-white rounded-[8px] outline-1 outline-offset-[-1px] transition-all flex flex-col justify-center h-[58px]",
        {
          "px-[16px] py-[8px]": showLabel,
          "p-[16px]": !showLabel,
          [borderColorClass]: true,
          "shadow-[0px_0px_0px_2px_rgba(116,127,210,0.25)]": showShadow,
        }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="w-full flex justify-between items-center">
        <div className={`flex flex-col ${showLabel ? "gap-[4px]" : ""} w-full`}>
          {showLabel && (
            <label className={clsx("text-detail3", labelColorClass)}>
              {labelText}
            </label>
          )}
          <input
            ref={inputRef}
            type={visible ? "text" : "password"}
            value={value}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={!showLabel ? "Password" : ""}
            autoComplete="current-password"
            className={`
              w-full bg-transparent focus:outline-none
              text-body2
              ${showLabel ? "text-gray-80" : "text-gray-40 placeholder-gray-40"}
            `}
          />
        </div>

        {/* 포커스 or 입력 시 아이콘 표시 */}
        {(isFocused || hasText) && (
          <div className="flex items-center gap-2 ml-2">
            {visible ? (
              <EyeOffIcon
                className="w-4 h-4 cursor-pointer"
                onClick={handleEyeToggle}
              />
            ) : (
              <EyeIcon
                className="w-4 h-4 cursor-pointer"
                onClick={handleEyeToggle}
              />
            )}
            <XMarkGrayIcon
              className="w-4 h-4 cursor-pointer"
              onClick={() => handleChange("")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordInputField;
