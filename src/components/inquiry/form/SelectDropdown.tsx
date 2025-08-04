import { useRef, useState } from "react";

import clsx from "clsx";

import Down from "@/assets/svgs/common/down.svg";
import ProfileIcon from "@/assets/svgs/inquiry/profile.svg";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface Option {
  label: string;
  value: number;
}

interface Props {
  options: Option[];
  value: number;
  onChange: (value: number) => void;
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

  const handleSelect = (optionValue: number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const isYet = !value && !isOpen;
  const isDefault = !!value && !isOpen;
  const isSelect = isOpen;

  const borderStyle = clsx({
    "border border-gray-40 bg-white rounded-t-[5px]":
      type === "default" && isYet,
    "border-t-main border-t border-b border-b-white bg-white rounded-t-[5px]":
      type === "default" && isDefault,
    "border border-main rounded-t-[5px] bg-white":
      type === "default" && isSelect,
    "border border-gray-40 rounded-[5px]": type !== "default" && isYet,
    "border border-main  rounded-[5px]": type !== "default" && isSelect,
    "border border-main bg-main rounded-[5px]": type !== "default" && isDefault,
  });

  const selectedOptionLabel = options.find(opt => opt.value === value)?.label;

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
          {selectedOptionLabel || placeholder}
        </span>
        <span className={isOpen ? "rotate-180" : ""}>
          <Down
            className={clsx(
              "h-6 w-6",
              isYet
                ? "text-gray-40"
                : type === "default"
                  ? "text-gray-50"
                  : isDefault
                    ? "text-white"
                    : "text-gray-40"
            )}
          />
        </span>
      </button>

      {isOpen && (
        <ul className="absolute w-full border mt-2 rounded-[5px] bg-white z-50 max-h-[236px] overflow-y-auto scrollbar-hide text-detail1 text-gray-60 border-gray-20">
          {options.map(option => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={clsx(
                "cursor-pointer hover:bg-gray-10 active:text-detail1-b",
                type === "user"
                  ? "flex gap-2 px-3 py-2 items-center"
                  : "flex justify-between items-center p-3",
                option.value === value && "text-main text-detail1-b"
              )}
            >
              {type === "user" ? (
                <div className="w-full flex text-body2 gap-2 active:text-body2-b">
                  <ProfileIcon className="w-5 h-5" />
                  <span className="text-gray-90">{option.label}</span>
                </div>
              ) : (
                <>
                  <span>{option.label}</span>
                  <span
                    className={clsx(
                      "w-3 h-3 rounded-full",
                      option.value === value ? "bg-main" : "bg-gray-30"
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
