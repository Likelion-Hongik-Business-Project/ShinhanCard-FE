import { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import CloseIcon from "@/assets/svgs/inquiry/close.svg";
import ProfileIcon from "@/assets/svgs/inquiry/profile.svg";
import UserCheckIcon from "@/assets/svgs/inquiry/user-check.svg";
import { useDebounce } from "@/hooks/useDebounce";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { User } from "@/types/user";

import DepartmentSelector from "./DepartmentSelector";
import UserSearchList from "./UserSearchList";

interface Props {
  label: string;
  placeholder: string;
  maxCount: number;
  allUsers: User[];
  isOpen: boolean;
  onDropdownToggle: (isOpen: boolean) => void;
}

const UserMultiSelectInput = ({
  label,
  placeholder,
  maxCount,
  isOpen,
  allUsers,
  onDropdownToggle,
}: Props) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState("");

  const debouncedInput = useDebounce(inputValue, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => {
    if (isOpen) {
      onDropdownToggle(false);
    }
  });

  const handleSelectUser = (user: User) => {
    if (selectedUsers.some(u => u.id === user.id)) return;
    if (selectedUsers.length >= maxCount) return;

    setSelectedUsers(prev => [...prev, user]);
    setInputValue("");
  };

  const handleRemoveUser = (id: number) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== id));
  };

  const filteredUsers = allUsers
    .filter(u =>
      u.user_name.toLowerCase().includes(debouncedInput.trim().toLowerCase())
    )
    .filter(u => !selectedUsers.some(selected => selected.id === u.id));

  useEffect(() => {
    if (selectedUsers.length >= maxCount && inputValue !== "") {
      setInputValue("");
    }
  }, [selectedUsers, inputValue, maxCount]);

  return (
    <div
      ref={containerRef}
      className="flex gap-7.5 items-center relative w-full"
    >
      <div className="flex gap-2 items-center">
        <UserCheckIcon />
        <span className="text-body2 text-gray-60">{label}</span>
      </div>

      <div className="relative w-[728px]">
        <div
          className={clsx(
            "rounded-[5px] px-2 py-1 cursor-pointer text-body2 flex flex-wrap items-center gap-4",
            selectedUsers.length > 0 || isOpen
              ? "bg-gray-10 border-gray-40"
              : "bg-white text-gray-30 border-none",
            "hover:bg-gray-10"
          )}
          onClick={() => onDropdownToggle(true)}
        >
          {selectedUsers.map(user => (
            <div
              key={user.id}
              className="flex items-center gap-1.5 bg-gray-10 rounded"
            >
              <div className="flex gap-2 items-center">
                <ProfileIcon />
                <span>{user.user_name}</span>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveUser(user.id);
                }}
                className="cursor-pointer"
              >
                <CloseIcon className="w-[18.833px] h-[18.833px]" />
              </button>
            </div>
          ))}
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="flex-1 min-w-0 cursor-pointer outline-none text-gray-100 placeholder:text-gray-30 bg-transparent"
            placeholder={selectedUsers.length === 0 ? placeholder : ""}
          />
        </div>

        <div className="relative w-full">
          {isOpen && (
            <div className="absolute top-full mt-1 w-full bg-white rounded-[5px] shadow-02 flex flex-col z-50">
              {inputValue.trim() === "" ? (
                <DepartmentSelector onSelectUser={handleSelectUser} />
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col gap-4 p-2">
                  <span className="text-detail1 text-gray-50">
                    사용자를 선택하세요
                  </span>
                  <span className="text-detail1 bg-gray-10 py-2 px-1 flex items-center text-gray-60">
                    없음
                  </span>
                </div>
              ) : (
                <UserSearchList
                  users={filteredUsers}
                  onSelectUser={handleSelectUser}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMultiSelectInput;
