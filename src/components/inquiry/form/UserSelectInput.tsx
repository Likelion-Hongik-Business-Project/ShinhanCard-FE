import { useRef, useState } from "react";

import clsx from "clsx";

import CloseIcon from "@/assets/svgs/inquiry/close.svg";
import ProfileIcon from "@/assets/svgs/inquiry/profile.svg";
import UserCheckIcon from "@/assets/svgs/inquiry/user-check.svg";
import { MOCK_USERS } from "@/constants/usersMock";
import { useOutsideClick } from "@/hooks/useOutsideClick";

import DepartmentSelector from "./DepartmentSelector";
import UserSearchList from "./UserSearchList";

interface UserMultiSelectInputProps {
  label: string;
  placeholder: string;
  maxCount: number;
}

const UserMultiSelectInput = ({
  label,
  placeholder,
  maxCount,
}: UserMultiSelectInputProps) => {
  const [selectedUsers, setSelectedUsers] = useState<typeof MOCK_USERS>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setIsOpen(false));

  const handleSelectUser = (user: (typeof MOCK_USERS)[0]) => {
    if (selectedUsers.length >= maxCount) return;
    if (selectedUsers.some(u => u.id === user.id)) return;

    setSelectedUsers(prev => [...prev, user]);
    setInputValue("");
  };

  const handleRemoveUser = (id: number) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== id));
  };

  const filteredUsers = MOCK_USERS.filter(u => u.name.includes(inputValue));

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
          onClick={() => setIsOpen(true)}
        >
          {selectedUsers.map(user => (
            <div
              key={user.id}
              className="flex items-center gap-1.5 bg-gray-10 rounded"
            >
              <div className="flex gap-2 items-center">
                <ProfileIcon />
                <span>{user.name}</span>
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
            className="flex-1 cursor-pointer outline-none text-gray-100 placeholder:text-gray-30 bg-transparent"
            placeholder={selectedUsers.length === 0 ? placeholder : ""}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full mt-1 w-full bg-white rounded-[5px]  shadow-02 flex flex-col z-50">
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
  );
};

export default UserMultiSelectInput;
