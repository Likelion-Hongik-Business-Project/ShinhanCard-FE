import { useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";

import CloseIcon from "@/assets/svgs/inquiry/close.svg";
import ProfileIcon from "@/assets/svgs/inquiry/profile.svg";
import UserCheckIcon from "@/assets/svgs/inquiry/user-check.svg";
import Modal from "@/components/common/Modal";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useOutsideClick } from "@/hooks/common/useOutsideClick";
import { AssigneeUser } from "@/types/team/user.type";

import DepartmentSelector from "./DepartmentSelector";
import UserSearchList from "./UserSearchList";

interface Props {
  label: string;
  placeholder: string;
  maxCount: number;
  allUsers: AssigneeUser[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  isOpen: boolean;
  onDropdownToggle: (isOpen: boolean) => void;
}

const UserMultiSelectInput = ({
  label,
  placeholder,
  maxCount,
  allUsers,
  selectedIds,
  onChange,
  isOpen,
  onDropdownToggle,
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);

  const debouncedInput = useDebounce(inputValue, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => {
    if (isOpen) onDropdownToggle(false);
  });

  const isOrgActive = (u: AssigneeUser) =>
    Boolean(u?.group?.active ?? u?.group?.active ?? true) &&
    Boolean(u?.division?.active ?? u?.division?.active ?? true) &&
    Boolean(u?.team?.active ?? u?.team?.active ?? true);

  const hasActive = (v: unknown): v is { active: boolean } =>
    typeof v === "object" &&
    v !== null &&
    "active" in v &&
    typeof (v as { active?: unknown }).active === "boolean";

  const isUserActive = (u: AssigneeUser) =>
    (hasActive(u) ? u.active : true) && isOrgActive(u);

  const searchTerm = debouncedInput.trim().toLowerCase();

  const sortByName = (a: AssigneeUser, b: AssigneeUser) => {
    const nameA = a.username ?? "";
    const nameB = b.username ?? "";

    const startsA = nameA.toLowerCase().startsWith(searchTerm);
    const startsB = nameB.toLowerCase().startsWith(searchTerm);

    if (startsA && !startsB) return -1;
    if (!startsA && startsB) return 1;

    return nameA.localeCompare(nameB, "ko");
  };

  // 선택된 유저
  const selectedUsers = useMemo(() => {
    if (!selectedIds) return [];
    return allUsers
      .filter(u => selectedIds.includes(u.user_id) && isUserActive(u))
      .sort(sortByName);
  }, [allUsers, selectedIds]);

  // 검색 목록
  const filteredUsers = allUsers
    .filter(isUserActive)
    .filter(u =>
      (u.username ?? "")
        .toLowerCase()
        .includes(debouncedInput.trim().toLowerCase())
    )
    .filter(u => !selectedIds?.includes(u.user_id))
    .sort(sortByName);

  const handleSelectUser = (user: AssigneeUser) => {
    if (user.user_id === undefined) return;

    if (selectedIds.includes(user.user_id)) return;

    if (selectedIds.length >= maxCount) {
      setShowLimitModal(true);
      return;
    }

    onChange([...selectedIds, user.user_id]);
    setInputValue("");
  };

  const handleRemoveUser = (id: number) => {
    onChange(selectedIds.filter(userId => userId !== id));
  };

  useEffect(() => {
    if (selectedIds?.length >= maxCount && inputValue !== "") {
      setInputValue("");
    }
  }, [selectedIds, inputValue, maxCount]);

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
            selectedIds?.length > 0 || isOpen
              ? "bg-gray-10 border-gray-40"
              : "bg-white text-gray-30 border-none",
            "hover:bg-gray-10"
          )}
          onClick={() => onDropdownToggle(true)}
        >
          {selectedUsers.map(user => (
            <div
              key={user.user_id}
              className="flex items-center gap-1.5 bg-gray-10 rounded"
            >
              <div className="flex gap-2 items-center">
                {user.profile_url ? (
                  <img
                    src={user.profile_url}
                    alt="프로필 이미지"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <ProfileIcon />
                )}
                <span>{user.username}</span>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveUser(user.user_id);
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
            placeholder={selectedIds?.length === 0 ? placeholder : ""}
          />
        </div>

        <div className="relative w-full">
          {isOpen && (
            <div className="absolute top-full mt-1 w-full bg-white rounded-[5px] shadow-02 flex flex-col z-50">
              {inputValue.trim() === "" ? (
                <DepartmentSelector
                  allUsers={allUsers}
                  onSelectUser={handleSelectUser}
                />
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

      {showLimitModal && (
        <Modal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          title={
            label === "답변 담당자"
              ? "담당자는 최대 3명까지 가능합니다"
              : "참조자는 최대 5명까지 가능합니다"
          }
          buttons={[
            {
              label: "확인",
              onClick: () => setShowLimitModal(false),
              type: "blue",
            },
          ]}
        />
      )}
    </div>
  );
};

export default UserMultiSelectInput;
