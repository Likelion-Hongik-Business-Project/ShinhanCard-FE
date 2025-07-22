import { useState } from "react";

import InquiryForm from "@/components/inquiry/form/InquiryForm";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";

import { ORGANIZATION } from "@/mocks/organizationMock";

const InquiryFormPage = () => {
  const [group, setGroup] = useState("");
  const [division, setDivision] = useState("");
  const [team, setTeam] = useState("");

  const groupOptions = ORGANIZATION.map(item => item.group);
  const selectedGroup = ORGANIZATION.find(item => item.group === group);
  const divisionOptions = selectedGroup
    ? selectedGroup.divisions.map(d => d.division_name)
    : [];

  const selectedDivision = selectedGroup?.divisions.find(
    d => d.division_name === division
  );
  const teamOptions = selectedDivision ? selectedDivision.teams : [];

  return (
    <section className="flex flex-col gap-2 w-full">
      <h1 className="text-heading1 text-gray-80 mb-10">문의 작성하기</h1>

      <div className="flex gap-2">
        <SelectDropdown
          options={groupOptions}
          value={group}
          onChange={value => {
            setGroup(value);
            setDivision("");
            setTeam("");
          }}
          placeholder="그룹 선택"
        />
        <SelectDropdown
          options={divisionOptions}
          value={division}
          onChange={value => {
            setDivision(value);
            setTeam("");
          }}
          placeholder="본부 선택"
          disabled={!group}
        />
        <SelectDropdown
          options={teamOptions}
          value={team}
          onChange={setTeam}
          placeholder="팀 선택"
          disabled={!division}
        />
      </div>

      <InquiryForm group={group} division={division} team={team} />
    </section>
  );
};

export default InquiryFormPage;
