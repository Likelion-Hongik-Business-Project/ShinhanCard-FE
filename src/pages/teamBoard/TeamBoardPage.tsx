import { useState } from "react";

import Header from "@/components/TeamBoard/Header";
import InquiryList from "@/components/TeamBoard/InquiryList";
import Pagination from "@/components/TeamBoard/Pagination";
import { mockTeamBoardResponse } from "@/mocks/mockTeamBoardResponse";

const TeamBoardPage = () => {
  const [isTeamEnd] = useState<boolean>(false);

  return (
    <section className="w-full max-w-[1420px] h-[835px] flex flex-col">
      <div className="w-full mx-auto flex flex-col gap-10">
        <Header
          group_name={mockTeamBoardResponse.group_name}
          division_name={mockTeamBoardResponse.division_name}
          team_name={mockTeamBoardResponse.team_name}
          isTeamEnd={isTeamEnd}
        />

        <div className="bg-white rounded-[15px] flex flex-col max-h-[652px] overflow-auto">
          <InquiryList
            group_name={mockTeamBoardResponse.group_name}
            division_name={mockTeamBoardResponse.division_name}
            team_name={mockTeamBoardResponse.team_name}
            inquiries={mockTeamBoardResponse.inquiries}
          />
        </div>

        <Pagination />
      </div>
    </section>
  );
};

export default TeamBoardPage;
