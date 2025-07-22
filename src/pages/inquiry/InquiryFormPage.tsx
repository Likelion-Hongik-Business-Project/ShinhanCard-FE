import InquiryForm from "@/components/inquiry/form/InquiryForm";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";
import { useOrganizationSelector } from "@/hooks/useOrganizationSelector";

const InquiryFormPage = () => {
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
    <section className="flex flex-col gap-2 w-full">
      <h1 className="text-heading1 text-gray-80 mb-10">문의 작성하기</h1>

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

      <InquiryForm group={group} division={division} team={team} />
    </section>
  );
};

export default InquiryFormPage;
