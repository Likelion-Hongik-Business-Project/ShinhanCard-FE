import { useState } from "react";

import {
  ActiveHeart,
  ActiveMessage,
  ActivePencil,
  Heart,
  Message,
  Pencil,
} from "@/assets/svgs/home";
// import HomeMember from "./HomeMember"; // 추후 구현

const buttonStyle =
  "w-[320px] h-[160px] px-[40px] py-[24px] bg-white border rounded-[12px] flex flex-col justify-center items-start gap-2";

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
        className={`${buttonStyle} ${isActive ? "bg-[var(--color-state-progress-01)] border-[var(--color-main)]" : "border-[var(--color-gray-20)]"}`}
      >
        {isActive ? <ActiveIcon /> : <DefaultIcon />}
        <p className="text-[var(--color-gray-80)] text-[18px] font-bold">
          {count}
        </p>
        <p className="text-[var(--color-gray-60)] text-[16px]">{label}</p>
      </button>
    );
  };

  return (
    <div className="flex justify-between items-center gap-4 mb-8">
      <div className="flex gap-4">
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

      <button className="flex items-center gap-[16px] px-[40px] py-[24px] bg-[var(--color-main)] text-white rounded-[12px]">
        <Pencil />
        문의 작성하기
      </button>
    </div>
  );
}
