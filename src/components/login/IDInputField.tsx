import { useState } from "react";

import XMarkGrayIcon from "@/assets/svgs/login/XMarkIcon_Gray.svg";
import XMarkRedIcon from "@/assets/svgs/login/XMarkIcon_Red.svg";
import XMarkYellowIcon from "@/assets/svgs/login/XMarkIcon_Yellow.svg";

interface Props {
  value: string; // 입력값
  setValue: (v: string) => void; // 입력값 변경 함수
  errorTypeID?: "none" | "invalid" | "notfound"; // 오류 상태
}

const IDInputField = ({ value, setValue, errorTypeID = "none" }: Props) => {
  const [isFocused, setIsFocused] = useState(false); // 포커스(클릭, 입력중) 여부
  const [isHovered, setIsHovered] = useState(false); // 호버 여부

  const hasText = value.length > 0; // 텍스트가 입력된 상태인지 확인

  /* 현재 상태 */
  const status =
    errorTypeID === "invalid" // 잘못된 형식
      ? "error"
      : errorTypeID === "notfound" // 존재하지 않는 사번
        ? "notfound"
        : isFocused // 클릭, 입력중
          ? "typing"
          : hasText // 입력 완료
            ? "done"
            : "default"; // 초기 상태

  /* 테두리 색상 (Tailwind 색상 변수로 대체) */
  const borderColor =
    status === "error"
      ? "var(--color-point-red)"
      : status === "notfound"
        ? "var(--color-point-yellow)"
        : isFocused || isHovered
          ? "var(--color-state-progress-02)"
          : "var(--color-gray-30)"; // 디폴트 회색

  /* 그림자 효과 */
  const boxShadow =
    status === "typing" ? "0px 0px 0px 2px rgba(116, 127, 210, 0.25)" : "none";

  /* 라벨(경고문) 텍스트 */
  const labelText =
    status === "error"
      ? "올바른 형식으로 사번을 입력해주세요."
      : status === "notfound"
        ? "존재하지 않는 사번입니다."
        : "Employee ID";

  /* 라벨(경고문) 색상 */
  const labelColor =
    status === "error"
      ? "var(--color-point-red)"
      : status === "notfound"
        ? "var(--color-point-yellow)"
        : "var(--color-gray-40)";

  /* 라벨(경고문) 표시 여부 */
  const showLabel = status !== "default";

  const handleChange = (text: string) => {
    setValue(text);
  };

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
    >
      <div className="w-full flex justify-between items-center">
        <div className={`flex flex-col ${showLabel ? "gap-[4px]" : ""} w-full`}>
          {showLabel && (
            <label className="text-detail3" style={{ color: labelColor }}>
              {labelText}
            </label>
          )}
          <input
            type="text"
            value={value}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            placeholder={!showLabel ? "Employee ID" : ""}
            className={`
              w-full bg-transparent focus:outline-none
              text-body2
              ${showLabel ? "text-gray-80" : "text-gray-40 placeholder-gray-40"}
            `}
          />
        </div>

        <div className="w-4 h-4 flex-shrink-0 ml-2">
          {status === "error" && (
            <XMarkRedIcon
              className="cursor-pointer"
              onClick={() => handleChange("")}
            />
          )}
          {status === "notfound" && (
            <XMarkYellowIcon
              className="cursor-pointer"
              onClick={() => handleChange("")}
            />
          )}
          {(status === "typing" || status === "done") && (
            <XMarkGrayIcon
              className="cursor-pointer"
              onClick={() => handleChange("")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IDInputField;
