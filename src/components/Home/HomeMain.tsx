import { useEffect, useState } from "react";

import {
  ActiveHeart,
  ActiveMessage,
  ActivePencil,
  Heart,
  HoverPencilWrite,
  Message,
  Pencil,
} from "@/assets/svgs/home";
import HomeMember from "@/components/Home/HomeMember";

const buttonStyle =
  "w-full min-w-64 max-w-80 px-10 py-7.75 border-2 rounded-[13px] flex flex-col justify-center items-start";

type InterestMember = {
  name: string;
  member_id: string;
  group_name: string;
  division_name: string;
  team_name: string;
  profile_image_url: string;
};

export default function HomeMain({
  answerCount,
  inquiryCount,
  interestCount,
}: {
  answerCount: number;
  inquiryCount: number;
  interestCount: number;
}) {
  const [activeTab, setActiveTab] = useState("answer");
  const [isHovered, setIsHovered] = useState(false);
  const [homeMember, setHomeMember] = useState<{
    interest_count: number;
    interest_member: InterestMember[];
  } | null>(null);

  useEffect(() => {
    if (activeTab === "interest") {
      fetch("/src/mocks/home/homeMember.json")
        .then(res => res.json())
        .then(data => setHomeMember(data));
    }
  }, [activeTab]);

  const Button = ({
    type,
    count,
    label,
    DefaultIcon,
    ActiveIcon,
  }: {
    type: string;
    count: number;
    label: string;
    DefaultIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    ActiveIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }) => {
    const isActive = activeTab === type;
    return (
      <button
        onClick={() => setActiveTab(type)}
        className={`${buttonStyle} ${isActive ? "bg-state-progress-01 border-main" : "bg-white border-2 border-gray-20"}`}
      >
        <p className="text-gray-80 text-[48px] font-bold leading-[120%] font-pretendard">
          {count}
        </p>
        <div className="flex w-full justify-between items-center gap-2">
          <div className="flex h-full flex-col justify-end">
            <p
              className={`${isActive ? "text-gray-80" : "text-gray-60"} text-heading3-sb`}
            >
              {label}
            </p>
          </div>
          {isActive ? <ActiveIcon /> : <DefaultIcon />}
        </div>
      </button>
    );
  };

  return (
    <>
      <div className="flex h-40 justify-between items-center gap-4 mb-20">
        <div className="flex gap-4 w-full">
          <Button
            type="answer"
            count={answerCount}
            label="미확인 답변"
            DefaultIcon={Pencil}
            ActiveIcon={ActivePencil}
          />
          <Button
            type="inquiry"
            count={inquiryCount}
            label="미확인 문의"
            DefaultIcon={Message}
            ActiveIcon={ActiveMessage}
          />
          <Button
            type="interest"
            count={interestCount}
            label="관심 팀원"
            DefaultIcon={Heart}
            ActiveIcon={ActiveHeart}
          />
        </div>

        <button
          className={`flex flex-col min-w-49.25 h-40 items-center gap-4 px-10 py-10 rounded-[13px] transition-colors text-white
            ${isHovered ? "bg-main-dark" : "bg-main"}
              `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? <HoverPencilWrite /> : <Pencil />}
          <p
            className={`text-heading3 ${isHovered ? "text-gray-30" : "text-white"}`}
          >
            문의 작성하기
          </p>
        </button>
      </div>

      <div className="w-full h-auto">
        {activeTab === "answer" && (
          <div className="w-full h-[512px] bg-gray-200 flex items-center justify-center text-xl text-gray-500">
            임시 답변 컴포넌트 영역
          </div>
        )}
        {activeTab === "inquiry" && (
          <div className="w-full h-[512px] bg-gray-200 flex items-center justify-center text-xl text-gray-500">
            임시 문의 컴포넌트 영역
          </div>
        )}
        {activeTab === "interest" && homeMember && (
          <HomeMember
            interestCount={homeMember.interest_count}
            interestMember={homeMember.interest_member}
          />
        )}
      </div>
    </>
  );
}
