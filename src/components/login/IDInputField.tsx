import { useState } from "react";

import clsx from "clsx";

import XMarkGrayIcon from "@/assets/svgs/login/x-mark-gray.svg";
import XMarkRedIcon from "@/assets/svgs/login/x-mark-red.svg";
import XMarkYellowIcon from "@/assets/svgs/login/x-mark-yellow.svg";
import {
  BORDER_COLOR_MAP,
  ID_LABEL_TEXT,
  InputStatus,
  LABEL_COLOR_MAP,
} from "@/constants/login";

interface Props {
  value: string; // 입력값
  setValue: (v: string) => void; // 입력값 변경 함수
  errorTypeID?: "none" | "invalid" | "notfound"; // 오류 상태
}

const IDInputField = ({ value, setValue, errorTypeID = "none" }: Props) => {
  const [isFocused, setIsFocused] = useState(false); // 포커스(클릭, 입력중) 여부
  const [isHovered, setIsHovered] = useState(false); // 호버 여부

  const hasText = value.length > 0; // 텍스트가 입력된 상태인지 확인

  let status: InputStatus;

  if (errorTypeID === "invalid") {
    status = "error";
  } else if (errorTypeID === "notfound") {
    status = "notfound";
  } else if (isFocused) {
    status = "typing";
  } else if (hasText) {
    status = "done";
  } else {
    status = "default";
  }

  let borderColorClass = BORDER_COLOR_MAP[status];
  // 호버 시 파란색 border 적용
  if ((status === "done" || status === "default") && isHovered) {
    borderColorClass = BORDER_COLOR_MAP["typing"];
  }

  const labelText = ID_LABEL_TEXT[status] ?? "Employee ID";
  const labelColorClass = LABEL_COLOR_MAP[status] ?? "text-gray-40";

  /* 그림자 효과 - 포커스 상태일 때만 적용 */
  const showShadow = status === "typing";

  /* 라벨(경고문) 표시 여부 */
  const showLabel = status !== "default";

  const handleChange = (text: string) => {
    setValue(text);
  };

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
    >
      <div className="w-full flex justify-between items-center">
        <div className={`flex flex-col ${showLabel ? "gap-[4px]" : ""} w-full`}>
          {showLabel && (
            <label className={clsx("text-detail3", labelColorClass)}>
              {labelText}
            </label>
          )}
          <input
            type="text"
            value={value}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={!showLabel ? "Employee ID" : ""}
            autoComplete="username"
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
