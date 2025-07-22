import { useState } from "react";

import clsx from "clsx";

import PencilIcon from "@/assets/svgs/inquiry/pencil.svg";
import InquiryForm from "@/components/inquiry/form/InquiryForm";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";
import { useOrganizationSelector } from "@/hooks/useOrganizationSelector";

const InquiryFormPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    group,
    division,
    team,
    groupOptions,
    divisionOptions,
    teamOptions,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
  } = useOrganizationSelector();

  return (
    <section
      className={clsx(
        "flex flex-col  w-full",
        isDropdownOpen ? "pb-[220px]" : ""
      )}
    >
      <h1 className="text-heading1 text-gray-80 mb-10">문의 작성하기</h1>

      <div className="flex gap-2 flex-col">
        <div className="flex gap-2">
          <SelectDropdown
            options={groupOptions}
            value={group}
            onChange={handleGroupChange}
            placeholder="그룹 선택"
          />
          <SelectDropdown
            options={divisionOptions}
            value={division}
            onChange={handleDivisionChange}
            placeholder="본부 선택"
            disabled={!group}
          />
          <SelectDropdown
            options={teamOptions}
            value={team}
            onChange={handleTeamChange}
            placeholder="팀 선택"
            disabled={!division}
          />
        </div>

        <InquiryForm onDropdownStateChange={setIsDropdownOpen} />
      </div>

      <div className="flex gap-8 w-full justify-end mt-10">
        <button className="cursor-pointer text-heading3 text-gray-80 px-6 h-16 bg-white border border-gray-20 rounded-[15px]">
          임시저장
        </button>
        <button className="flex items-center cursor-pointer px-6 gap-4 h-16 rounded-[15px] bg-main">
          <PencilIcon />
          <span className="text-heading3 text-white">답변 보내기</span>
        </button>
      </div>
    </section>
  );
};

export default InquiryFormPage;
