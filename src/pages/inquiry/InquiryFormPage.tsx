import { useState } from "react";

import InquiryForm from "@/components/inquiry/form/InquiryForm";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";

const InquiryFormPage = () => {
  const [group, setGroup] = useState("");
  const [division, setDivision] = useState("");
  const [team, setTeam] = useState("");

  return (
    <section className="flex flex-col gap-2 w-full h-[835px]">
      <h1 className="text-heading1 text-gray-80 mb-10">문의 작성하기</h1>
      <div className="flex gap-2">
        <SelectDropdown
          options={[
            "그룹 A",
            "그룹 B",
            "그룹 C",
            "그룹 D",
            "그룹 E",
            "그룹 F",
            "그룹 G",
          ]} // 추후 구조 변경
          value={group}
          onChange={setGroup}
          placeholder="그룹 선택"
        />
        <SelectDropdown
          options={["소속본부 A", "소속본부 B"]}
          value={division}
          onChange={setDivision}
          placeholder="본부 선택"
        />
        <SelectDropdown
          options={["팀 A", "팀 B"]}
          value={team}
          onChange={setTeam}
          placeholder="팀 선택"
        />
      </div>
      <InquiryForm />
    </section>
  );
};

export default InquiryFormPage;
