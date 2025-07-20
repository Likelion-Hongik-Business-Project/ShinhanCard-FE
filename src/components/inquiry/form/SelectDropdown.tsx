import { useRef, useState } from "react";

import clsx from "clsx";

import Down from "@/assets/svgs/layout/down.svg";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface Props {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SelectDropdown = ({
  options,
  value,
  onChange,
  placeholder = "",
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

  return (
    <div className="relative w-43" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={clsx(
          "w-full flex justify-between items-center p-2 bg-white cursor-pointer rounded-t-[5px]",
          {
            "border border-gray-40": isYet,
            "border-t border-main": isDefault,
            "border border-main": isSelect,
          }
        )}
      >
        <span
          className={clsx(
            "text-body2",
            isYet ? "text-gray-40" : "text-gray-90"
          )}
        >
          {value || placeholder}
        </span>
        <span className={isOpen ? "rotate-180" : ""}>
          <Down className="text-gray-50" />
        </span>
      </button>

      {isOpen && (
        <ul className="absolute w-full border mt-2 rounded-[5px] bg-white z-10 max-h-[236px] overflow-y-auto text-detail1 text-gray-60 border-gray-20 scrollbar-hide">
          {options.map(option => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={clsx(
                "flex justify-between items-center p-3 cursor-pointer hover:bg-gray-10",
                option === value && "text-main text-detail1-b"
              )}
            >
              <span>{option}</span>
              <span
                className={clsx(
                  "w-3 h-3 rounded-full",
                  option === value ? "bg-main" : "bg-gray-30"
                )}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectDropdown;
