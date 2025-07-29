import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Heart } from "@/assets/svgs/commons";
import { Message, Pencil } from "@/assets/svgs/layout";
import HomeButton from "@/components/home/HomeButton";
import HomeMember from "@/components/home/HomeMember";
import { InterestMember } from "@/types/home";
import { homeMemberData } from "@/mocks/home";

type Props = {
  answerCount: number;
  inquiryCount: number;
  interestCount: number;
};

const HomeMain = ({ answerCount, inquiryCount, interestCount }: Props) => {
  const [activeTab, setActiveTab] = useState("answer");
  const [isHovered, setIsHovered] = useState(false);
  const [homeMember, setHomeMember] = useState<{
    interest_count: number;
    interest_member: InterestMember[];
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "interest") {
      setHomeMember(homeMemberData);
    }
  }, [activeTab]);

  return (
    <>
      <div className="flex h-40 justify-between items-center mb-20">
        <div className="flex gap-4 w-full">
          <HomeButton
            type="answer"
            count={answerCount}
            label="미확인 답변"
            icon={Pencil}
            isActive={activeTab === "answer"}
            onClick={setActiveTab}
          />
          <HomeButton
            type="inquiry"
            count={inquiryCount}
            label="미확인 문의"
            icon={Message}
            isActive={activeTab === "inquiry"}
            onClick={setActiveTab}
          />
          <HomeButton
            type="interest"
            count={interestCount}
            label="관심 팀원"
            icon={Heart}
            isActive={activeTab === "interest"}
            onClick={setActiveTab}
          />
        </div>
        <div className="min-w-[123px]"></div>
        <button
          className={`flex flex-col cursor-pointer min-w-49.25 h-40 items-center gap-4 p-10 rounded-[13px] transition-colors
            ${isHovered ? "bg-main-dark" : "bg-main"}
              `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => navigate("/inquiry/form")}
        >
          <Pencil
            className={
              isHovered ? "text-gray-30 w-10 h-10" : "text-white w-10 h-10"
            }
          />
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
};

export default HomeMain;
