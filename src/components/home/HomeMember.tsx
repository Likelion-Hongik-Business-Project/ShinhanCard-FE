import { useOutletContext } from "react-router-dom";

import AddMember from "@/components/home/AddMember";
import MemberCard from "@/components/home/MemberCard";

type InterestMember = {
  name: string;
  member_id: string;
  group_name: string;
  division_name: string;
  team_name: string;
  profile_image_url: string;
};

export default function HomeMember({
  interestCount,
  interestMember,
}: {
  interestCount: number;
  interestMember: InterestMember[];
}) {
  const { openAddMemberSidebar } = useOutletContext<{
    openAddMemberSidebar: () => void;
  }>();

  return (
    <div className="w-full h-auto">
      {interestCount === 0 && (
        <div className="w-full h-80 flex items-center justify-center border border-dashed border-gray-300 rounded-[16px]">
          <AddMember onClick={openAddMemberSidebar} />
        </div>
      )}
      {interestCount === 1 && (
        <div className="w-full h-80 flex gap-6">
          <div className="flex-1 h-full flex items-center justify-center">
            <MemberCard member={interestMember[0]} />
          </div>
          <div className="flex-1 h-80 flex items-center justify-center">
            <AddMember onClick={openAddMemberSidebar} />
          </div>
        </div>
      )}
      {interestCount === 2 && (
        <div className="flex flex-col gap-6">
          <div className="flex gap-6 w-full h-80">
            <div className="flex-1 h-full flex items-center justify-center">
              <MemberCard member={interestMember[0]} />
            </div>
            <div className="flex-1 h-full flex items-center justify-center">
              <MemberCard member={interestMember[1]} />
            </div>
          </div>
          <div className="w-full h-80 flex items-center justify-center">
            <AddMember onClick={openAddMemberSidebar} />
          </div>
        </div>
      )}
      {interestCount === 3 && (
        <div className="flex flex-col gap-6">
          <div className="flex gap-6 w-full h-80">
            <div className="flex-1 h-full flex items-center justify-center">
              <MemberCard member={interestMember[0]} />
            </div>
            <div className="flex-1 h-full flex items-center justify-center">
              <MemberCard member={interestMember[1]} />
            </div>
            <div className="flex-1 h-full flex items-center justify-center">
              <MemberCard member={interestMember[2]} />
            </div>
          </div>
          <div className="w-full h-80 flex items-center justify-center">
            <AddMember onClick={openAddMemberSidebar} />
          </div>
        </div>
      )}
      {interestCount >= 4 &&
        (() => {
          const rows = [];
          const fullRows = Math.floor(interestCount / 3);
          const remainder = interestCount % 3;
          let idx = 0;
          // 3개씩 꽉 찬 줄
          for (let i = 0; i < fullRows; i++) {
            rows.push(
              <div
                key={"row-" + i}
                className="flex gap-6 w-full h-80 last:mb-0"
              >
                <div className="flex-1 h-full flex items-center justify-center">
                  <MemberCard member={interestMember[idx++]} />
                </div>
                <div className="flex-1 h-full flex items-center justify-center">
                  <MemberCard member={interestMember[idx++]} />
                </div>
                <div className="flex-1 h-full flex items-center justify-center">
                  <MemberCard member={interestMember[idx++]} />
                </div>
              </div>
            );
          }
          // 마지막 줄
          if (remainder === 1) {
            rows.push(
              <div key="last-row-1" className="flex gap-6 w-full h-80">
                <div className="flex-1 h-full flex items-center justify-center">
                  <MemberCard member={interestMember[idx++]} />
                </div>
                <div className="flex-[2.052] h-full flex items-center justify-center">
                  <AddMember onClick={openAddMemberSidebar} />
                </div>
              </div>
            );
          } else if (remainder === 2) {
            rows.push(
              <div key="last-row-2" className="flex gap-6 w-full h-80">
                <div className="flex-1 h-full flex items-center justify-center">
                  <MemberCard member={interestMember[idx++]} />
                </div>
                <div className="flex-1 h-full flex items-center justify-center">
                  <MemberCard member={interestMember[idx++]} />
                </div>
                <div className="flex-1 h-full flex items-center justify-center">
                  <AddMember onClick={openAddMemberSidebar} />
                </div>
              </div>
            );
          } else if (remainder === 0) {
            rows.push(
              <div
                key="last-row-0"
                className="w-full h-80 flex items-center justify-center"
              >
                <AddMember onClick={openAddMemberSidebar} />
              </div>
            );
          }
          return <div className="flex flex-col gap-6">{rows}</div>;
        })()}
    </div>
  );
}
