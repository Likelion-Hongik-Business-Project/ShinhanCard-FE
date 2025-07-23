import { useState } from "react";

import FilterBar from "@/components/TeamBoard/FilterBar";
import Header from "@/components/TeamBoard/Header";
import InquiryList from "@/components/TeamBoard/InquiryList";
import Pagination from "@/components/TeamBoard/Pagination";

import { mockTeamBoardResponse } from "@/mocks/mockTeamBoardResponse";

const TeamBoardPage = () => {
  const [isItemExpandedMap, setIsItemExpandedMap] = useState<
    Record<number, boolean>
  >({});

  const handleToggleItem = (idx: number): void => {
    setIsItemExpandedMap(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <section className="w-full h-[835px]">
      <div className="max-w-[1420px] mx-auto font-sans flex flex-col gap-10">
        <Header
          group_name={mockTeamBoardResponse.group_name}
          division_name={mockTeamBoardResponse.division_name}
          team_name={mockTeamBoardResponse.team_name}
        />

        <div className="bg-white rounded-2xl">
          <FilterBar />
          <InquiryList
            inquiries={mockTeamBoardResponse.inquiries}
            isItemExpandedMap={isItemExpandedMap}
            onToggleItem={handleToggleItem}
          />
        </div>

        <Pagination />
      </div>
    </section>
  );
};

export default TeamBoardPage;
