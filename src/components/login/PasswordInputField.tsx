import { useEffect, useRef, useState } from "react";

import EyeIcon from "@/assets/svgs/login/EyeIcon.svg";
import EyeOffIcon from "@/assets/svgs/login/EyeOffIcon.svg";
import XMarkGrayIcon from "@/assets/svgs/login/XMarkIcon_Gray.svg";

import "@/styles/globals.css";

interface Props {
  value: string; // 입력값
  setValue: (v: string) => void; // 입력값 변경 함수
}

const PasswordInputField = ({ value, setValue }: Props) => {
  const [isFocused, setIsFocused] = useState(false); // 포커스 상태
  const [isHovered, setIsHovered] = useState(false); // 호버 상태
  const [visible, setVisible] = useState(false); // 비밀번호 보이기/숨기기
  const [cursorPos, setCursorPos] = useState<number | null>(null); // 커서 위치 기억

  const inputRef = useRef<HTMLInputElement>(null);
  const hasText = value.length > 0;

  /* label을 띄우는 조건 -> 텍스트가 입력된 상태, 포커스 상태 */
  const showLabel = isFocused || hasText;

  /* border 색상 */
  const borderColor =
    isFocused || isHovered
      ? "var(--color-state-progress-02)"
      : "var(--color-gray-30)";

  /* 그림자 효과 */
  const boxShadow = isFocused
    ? "0px 0px 0px 2px rgba(116, 127, 210, 0.25)"
    : "none";

  const handleChange = (text: string) => setValue(text);

  /* 비밀번호 보기 토글 + 커서 위치 유지 */
  const handleEyeToggle = () => {
    const input = inputRef.current;
    if (input) {
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
    }
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
      className="w-full bg-white rounded-[8px] outline-[1px] outline-offset-[-1px] transition-all"
      style={{
        outlineColor: borderColor,
        boxShadow: boxShadow,
        padding: showLabel ? "8px 16px" : "16px",
        height: "58px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="w-full flex justify-between items-center">
        <div className={`flex flex-col ${showLabel ? "gap-[4px]" : ""} w-full`}>
          {showLabel && (
            <label className="text-detail3 text-gray-40">Password</label>
          )}
          <input
            ref={inputRef}
            type={visible ? "text" : "password"}
            value={value}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={!showLabel ? "Password" : ""}
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
