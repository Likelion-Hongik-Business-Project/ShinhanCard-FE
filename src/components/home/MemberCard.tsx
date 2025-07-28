import { FilledHeart } from "@/assets/svgs/commons";
import { User } from "@/assets/svgs/home";
import { InterestMember } from "@/types/home";

type Props = {
  member: InterestMember;
};

export default function MemberCard({ member }: Props) {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-[15px] shadow-[0_4px_4px_0_rgba(0,0,0,0.10)] p-6">
      <div className="flex justify-end w-full">
        <FilledHeart className="w-6 h-6" />
      </div>
      <div className="flex justify-center w-full mb-6">
        <img
          src={member.profile_image_url}
          alt={member.name}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col items-center mb-6">
        <div className="text-heading3-sb mb-2">{member.name}</div>
        <div className="text-detail1 text-gray-80 mb-1">{member.team_name}</div>
        <div className="text-detail3 text-gray-60">
          {member.group_name} 그룹 &gt; {member.division_name}
        </div>
      </div>
      <button className="w-60 h-10 px-3 flex items-center justify-center gap-4 border border-gray-20 rounded-[12px] bg-white text-detail1 text-gray-80 mx-auto cursor-pointer">
        <User className="w-4 h-4" />
        {member.name}님 스페이스 방문하기
      </button>
    </div>
  );
}
