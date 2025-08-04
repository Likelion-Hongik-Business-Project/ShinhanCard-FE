import { useState } from "react";

import clsx from "clsx";

import PencilIcon from "@/assets/svgs/inquiry/pencil.svg";
import Button from "@/components/common/Button";
import InquiryForm from "@/components/inquiry/form/InquiryForm";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";
import { useOrganizationSelector } from "@/hooks/team/useOrganizationSelector";

const InquiryFormPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    groupId,
    divisionId,
    teamId,
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
            value={groupId ?? 0}
            onChange={handleGroupChange}
            placeholder="그룹 선택"
          />
          <SelectDropdown
            options={divisionOptions}
            value={divisionId ?? 0}
            onChange={handleDivisionChange}
            placeholder="본부 선택"
            disabled={!groupId}
          />
          <SelectDropdown
            options={teamOptions}
            value={teamId ?? 0}
            onChange={handleTeamChange}
            placeholder="팀 선택"
            disabled={!divisionId}
          />
        </div>

        <InquiryForm onDropdownStateChange={setIsDropdownOpen} />
      </div>

      <div className="flex gap-8 w-full justify-end mt-10">
        <Button className="white">임시저장</Button>
        <Button buttonType="blue">
          <PencilIcon />
          <span className="text-heading3 text-white">답변 보내기</span>
        </Button>
      </div>
    </section>
  );
};

export default InquiryFormPage;
