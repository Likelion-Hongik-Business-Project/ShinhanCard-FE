import { useRef, useState } from "react";

import clsx from "clsx";

import Down from "@/assets/svgs/common/down.svg";
import ProfileIcon from "@/assets/svgs/inquiry/profile.svg";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface Props {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "default" | "group" | "division" | "team" | "user";
  disabled?: boolean;
}

const SelectDropdown = ({
  options,
  value,
  onChange,
  placeholder = "",
  type = "default",
  disabled = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const isYet = !value && !isOpen;
  const isDefault = !!value && !isOpen;
  const isSelect = isOpen;

  const borderStyle = clsx({
    // default
    "border border-gray-40 rounded-t-[5px]": type === "default" && isYet,
    "border-t border-main rounded-t-[5px]": type === "default" && isDefault,
    "border border-main rounded-t-[5px]": type === "default" && isSelect,

    // 나머지
    "border border-gray-40 rounded-[5px]": type !== "default" && isYet,
    "border border-main  rounded-[5px]": type !== "default" && isSelect,
    "border border-main bg-main rounded-[5px]": type !== "default" && isDefault,
  });

  return (
    <div className="relative w-43" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        disabled={disabled}
        className={clsx(
          "w-full flex justify-between items-center p-2",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          borderStyle
        )}
      >
        <span
          className={clsx(
            "text-body2",
            isYet
              ? "text-gray-40"
              : type === "default"
                ? "text-gray-90"
                : isDefault
                  ? "text-white"
                  : "text-gray-80"
          )}
        >
          {value || placeholder}
        </span>
        <span className={isOpen ? "rotate-180" : ""}>
          <Down
            className={clsx(
              type === "default"
                ? "text-gray-50"
                : isDefault
                  ? "text-white"
                  : "text-gray-40"
            )}
          />
        </span>
      </button>

      {isOpen && (
        <ul className="absolute w-full border mt-2 rounded-[5px] bg-white z-10 max-h-[236px] overflow-y-auto text-detail1 text-gray-60 border-gray-20">
          {options.map(option => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={clsx(
                "cursor-pointer hover:bg-gray-10",
                type === "user"
                  ? "flex gap-2 px-3 py-2 items-center"
                  : "flex justify-between items-center p-3",
                option === value &&
                  type !== "user" &&
                  "text-main text-detail1-b"
              )}
            >
              {type === "user" ? (
                <>
                  <ProfileIcon className="w-5 h-5" />
                  <span className="text-body2 text-gray-90">{option}</span>
                </>
              ) : (
                <>
                  <span>{option}</span>
                  <span
                    className={clsx(
                      "w-3 h-3 rounded-full",
                      option === value ? "bg-main" : "bg-gray-30"
                    )}
                  />
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectDropdown;
