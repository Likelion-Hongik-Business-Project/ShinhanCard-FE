// import { useState } from "react";

// import HeartActive from "@/assets/svgs/layout/heart-active.svg";
// import Heart from "@/assets/svgs/layout/heart.svg";
// import BlueMessage from "@/assets/svgs/layout/message-blue.svg";
// import SkyMessage from "@/assets/svgs/layout/message-sky.svg";
// import BluePencil from "@/assets/svgs/layout/pencil-blue.svg";
// import SkyPencil from "@/assets/svgs/layout/pencil-sky.svg";
// import Pencil from "@/assets/svgs/layout/pencil.svg";
// import Profile from "@/assets/svgs/layout/profile.svg";
// import BlueStar from "@/assets/svgs/layout/star-blue.svg";
// import SkyStar from "@/assets/svgs/layout/star-sky.svg";
// import Upload from "@/assets/svgs/layout/upload.svg";
// import Button from "@/components/layout/Button";

// const tabs = [
//   {
//     key: "written",
//     label: "작성한 문의 내역",
//     activeIcon: BluePencil,
//     inactiveIcon: SkyPencil,
//   },
//   {
//     key: "assigned",
//     label: "담당한 문의 내역",
//     activeIcon: BlueMessage,
//     inactiveIcon: SkyMessage,
//   },
//   {
//     key: "scrap",
//     label: "스크랩 내역",
//     activeIcon: BlueStar,
//     inactiveIcon: SkyStar,
//   },
// ] as const;

// const UserSpacePage = () => {
//   const [isHearted, setIsHearted] = useState(false);

//   const [activeTab, setActiveTab] =
//     useState<(typeof tabs)[number]["key"]>("written");

//   const getTabClass = (tabKey: string) =>
//     [
//       activeTab === tabKey
//         ? "bg-[var(--01,#DAE1F4)] border-[2px] border-[var(--Main,#19398C)]"
//         : "bg-[var(--White,#FFF)] border border-[var(--Gray-20,#DDE2E7)]",
//       "flex flex-col justify-center items-center gap-[16px] rounded-[13px] w-[462.667px] h-[160px] px-[40px]",
//     ].join(" ");

//   return (
//     <section className="w-full h-[835px] bg-gray-50 flex flex-col items-start p-0">
//       <div className="flex w-full items-center gap-4">
//         <div
//           className="w-[160px] h-[160px] rounded-full relative overflow-hidden"
//           style={{
//             aspectRatio: "1 / 1",
//             background:
//               "linear-gradient(0deg, rgba(38, 40, 76, 0.2), rgba(38, 40, 76, 0.2)), lightgray",
//           }}
//         >
//           <Profile className="w-full h-full object-cover" />
//         </div>

//         <div className="pl-10">
//           <h1 className="text-[32px] font-bold leading-[120%] text-black font-pretendard">
//             장윤영님 스페이스
//           </h1>

//           <div className="flex items-center gap-2 mt-4">
//             <h2 className="font-semibold text-[20px] leading-[120%] text-[var(--Main,#19398C)] font-pretendard">
//               Core 개발 2부
//             </h2>
//             <p className="text-[16px] leading-[150%] text-[var(--Gray-60,#6C7582)] font-pretendard font-normal">
//               경영 기획 그룹 &gt; ICT 본부
//             </p>
//           </div>
//         </div>

//         <Button variant="third" size="md" rounded="lg" className="ml-auto">
//           <Pencil className="w-[16px] h-[16px] aspect-square" />
//           <span className="text-[20px] font-normal leading-[120%] font-pretendard text-white">
//             장윤영님에게 문의 작성
//           </span>
//         </Button>
//         <Button
//           variant="HeartButton"
//           size="sm"
//           rounded="lg"
//           onClick={() => setIsHearted(prev => !prev)}
//         >
//           {isHearted ? (
//             <HeartActive className="w-[24px] h-[24px] aspect-square" />
//           ) : (
//             <Heart className="w-[24px] h-[24px] aspect-square" />
//           )}
//         </Button>
//       </div>

//       <div className="flex gap-4 mt-4 pt-20">
//         {tabs.map(
//           ({
//             key,
//             label,
//             activeIcon: ActiveIcon,
//             inactiveIcon: InactiveIcon,
//           }) => (
//             <Button
//               key={key}
//               className={getTabClass(key)}
//               onClick={() => setActiveTab(key)}
//             >
//               {activeTab === key ? (
//                 <ActiveIcon className="w-[40px] h-[40px] flex-shrink-0 aspect-square" />
//               ) : (
//                 <InactiveIcon className="w-[40px] h-[40px] flex-shrink-0 aspect-square" />
//               )}
//               <span
//                 className={`text-[24px] font-bold leading-[120%] font-pretendard ${
//                   activeTab === key
//                     ? "text-[var(--Main-Dark,#0B225F)]"
//                     : "text-[var(--Gray-50,#8A94A0)]"
//                 }`}
//               >
//                 {label}
//               </span>
//             </Button>
//           )
//         )}
//       </div>
//       <div className="flex items-center w-full pt-10">
//         <p className="text-[32px] font-bold leading-[120%] text-black text-center font-pretendard">
//           장윤영님이 쓴 문의 (6)
//         </p>
//         <Button
//           variant="ExportButton"
//           size="ExportSize"
//           rounded="lg"
//           className="ml-auto"
//         >
//           <Upload />
//           <p>Export</p>
//         </Button>
//       </div>
//     </section>
//   );
// };

// export default UserSpacePage;

import { useState } from "react";

import Heart from "@/assets/svgs/layout/heart.svg";
import HeartActive from "@/assets/svgs/layout/heart-active.svg";
import BlueMessage from "@/assets/svgs/layout/message-blue.svg";
import SkyMessage from "@/assets/svgs/layout/message-sky.svg";
import Pencil from "@/assets/svgs/layout/pencil.svg";
import BluePencil from "@/assets/svgs/layout/pencil-blue.svg";
import SkyPencil from "@/assets/svgs/layout/pencil-sky.svg";
import Profile from "@/assets/svgs/layout/profile.svg";
import BlueStar from "@/assets/svgs/layout/star-blue.svg";
import SkyStar from "@/assets/svgs/layout/star-sky.svg";
import Upload from "@/assets/svgs/layout/upload.svg";
import Button from "@/components/layout/Button";

// import AssignedInquiries from "@/components/userSpace/AssignedInquiries";
// import ScrappedInquiries from "@/components/userSpace/ScrappedInquiries";
// import WrittenInquiries from "@/components/userSpace/WrittenInquiries";

const tabs = [
  {
    key: "written",
    label: "작성한 문의 내역",
    activeIcon: BluePencil,
    inactiveIcon: SkyPencil,
  },
  {
    key: "assigned",
    label: "담당한 문의 내역",
    activeIcon: BlueMessage,
    inactiveIcon: SkyMessage,
  },
  {
    key: "scrap",
    label: "스크랩 내역",
    activeIcon: BlueStar,
    inactiveIcon: SkyStar,
  },
] as const;

const UserSpacePage = () => {
  const [isHearted, setIsHearted] = useState(false);
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["key"]>("written");

  const getTabClass = (tabKey: string) =>
    [
      activeTab === tabKey
        ? "bg-[var(--01,#DAE1F4)] border-[2px] border-[var(--Main,#19398C)]"
        : "bg-[var(--White,#FFF)] border border-[var(--Gray-20,#DDE2E7)]",
      "flex flex-col justify-center items-center gap-[16px] rounded-[13px] w-[462.667px] h-[160px] px-[40px]",
    ].join(" ");

  return (
    <section className="w-full h-[835px] bg-gray-50 flex flex-col items-start p-0">
      <div className="flex w-full items-center gap-4">
        <div
          className="w-[160px] h-[160px] rounded-full relative overflow-hidden"
          style={{
            aspectRatio: "1 / 1",
            background:
              "linear-gradient(0deg, rgba(38, 40, 76, 0.2), rgba(38, 40, 76, 0.2)), lightgray",
          }}
        >
          <Profile className="w-full h-full object-cover" />
        </div>

        <div className="pl-10">
          <h1 className="text-[32px] font-bold leading-[120%] text-black font-pretendard">
            장윤영님 스페이스
          </h1>

          <div className="flex items-center gap-2 mt-4">
            <h2 className="font-semibold text-[20px] leading-[120%] text-[var(--Main,#19398C)] font-pretendard">
              Core 개발 2부
            </h2>
            <p className="text-[16px] leading-[150%] text-[var(--Gray-60,#6C7582)] font-pretendard font-normal">
              경영 기획 그룹 &gt; ICT 본부
            </p>
          </div>
        </div>

        <Button variant="third" size="md" rounded="lg" className="ml-auto">
          <Pencil className="w-[16px] h-[16px] aspect-square" />
          <span className="text-[20px] font-normal leading-[120%] font-pretendard text-white">
            장윤영님에게 문의 작성
          </span>
        </Button>
        <Button
          variant="HeartButton"
          size="sm"
          rounded="lg"
          onClick={() => setIsHearted(prev => !prev)}
        >
          {isHearted ? (
            <Heart className="w-[24px] h-[24px] aspect-square" />
          ) : (
            <HeartActive className="w-[24px] h-[24px] aspect-square" />
          )}
        </Button>
      </div>

      <div className="flex gap-4 mt-4 pt-20">
        {tabs.map(
          ({
            key,
            label,
            activeIcon: ActiveIcon,
            inactiveIcon: InactiveIcon,
          }) => (
            <Button
              key={key}
              className={getTabClass(key)}
              onClick={() => setActiveTab(key)}
            >
              {activeTab === key ? (
                <ActiveIcon className="w-[40px] h-[40px] flex-shrink-0 aspect-square" />
              ) : (
                <InactiveIcon className="w-[40px] h-[40px] flex-shrink-0 aspect-square" />
              )}
              <span
                className={`text-[24px] font-bold leading-[120%] font-pretendard ${
                  activeTab === key
                    ? "text-[var(--Main-Dark,#0B225F)]"
                    : "text-[var(--Gray-50,#8A94A0)]"
                }`}
              >
                {label}
              </span>
            </Button>
          )
        )}
      </div>

      <div className="flex items-center w-full pt-10">
        <p className="text-[32px] font-bold leading-[120%] text-black text-center font-pretendard">
          장윤영님이 쓴 문의 (6)
        </p>
        <Button
          variant="ExportButton"
          size="ExportSize"
          rounded="lg"
          className="ml-auto"
        >
          <Upload />
          <p>Export</p>
        </Button>
      </div>

      {/* <div className="w-full mt-10">
        {activeTab === "written" && <WrittenInquiries />}
        {activeTab === "assigned" && <AssignedInquiries />}
        {activeTab === "scrap" && <ScrappedInquiries />}
      </div> */}
    </section>
  );
};

export default UserSpacePage;
