import React, { useState } from "react";

import {
  Arrow,
  Clock,
  DoubleArrow,
  Loader,
  Pen,
  Star,
  Upload,
  Users,
} from "@/assets/svgs/board";

interface Question {
  title: string;
  body: string;
}

const mockQuestions: Question[] = [
  {
    title: "피그마 어떻게 써요",
    body: `당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 
다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다.
또한, 한 개의 휴대폰 번호로 계정 1개만 생성할 수 있으며, CI 기준으로는 최대 3개의 계정을 만들 수 있습니다.
아래의 경우에는 계정 생성 및 로그인을 승인하지 않을 수 있습니다.
계정은 본인만 이용할 수 있고, 다른 사람에게 이용을 허락하거나 양도할 수 없는 것이 원칙입니다. 사용자는 계정과 관련된 정보, 즉 프로필 사진이나 별명 등을 수정할 수 있습니다. 휴대폰 번호가 바뀐 경우에는 서비스 내 설정 메뉴나 고객센터 문의를 통해 새 휴대폰 본인인증 절차를 걸쳐 수정할 수 있....`,
  },
  {
    title: "피그마 어떻게 써요",
    body: `당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 
다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다. 
또한, 한 개의 휴대폰 번호로 계정 1개만 생성할 수 있으며, CI 기준으로는 최대 3개의 계정을 만들 수 있습니다. 
아래의 경우에는 계정 생성 및 로그인을 승인하지 않을 수 있습니다.
계정은 본인만 이용할 수 있고, 다른 사람에게 이용을 허락하거나 양도할 수 없는 것이 원칙입니다. 사용자는 계정과 관련된 정보, 즉 프로필 사진이나 별명 등을 수정할 수 있습니다. 휴대폰 번호가 바뀐 경우에는 서비스 내 설정 메뉴나 고객센터 문의를 통해 새 휴대폰 본인인증 절차를 걸쳐 수정할 수 있....`,
  },
  {
    title: "피그마 어떻게 써요",
    body: `당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 
다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다. 
또한, 한 개의 휴대폰 번호로 계정 1개만 생성할 수 있으며, CI 기준으로는 최대 3개의 계정을 만들 수 있습니다. 
아래의 경우에는 계정 생성 및 로그인을 승인하지 않을 수 있습니다.
계정은 본인만 이용할 수 있고, 다른 사람에게 이용을 허락하거나 양도할 수 없는 것이 원칙입니다. 사용자는 계정과 관련된 정보, 즉 프로필 사진이나 별명 등을 수정할 수 있습니다. 휴대폰 번호가 바뀐 경우에는 서비스 내 설정 메뉴나 고객센터 문의를 통해 새 휴대폰 본인인증 절차를 걸쳐 수정할 수 있....`,
  },
  {
    title: "피그마 어떻게 써요",
    body: `당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 
다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다. 
또한, 한 개의 휴대폰 번호로 계정 1개만 생성할 수 있으며, CI 기준으로는 최대 3개의 계정을 만들 수 있습니다. 
아래의 경우에는 계정 생성 및 로그인을 승인하지 않을 수 있습니다.
계정은 본인만 이용할 수 있고, 다른 사람에게 이용을 허락하거나 양도할 수 없는 것이 원칙입니다. 사용자는 계정과 관련된 정보, 즉 프로필 사진이나 별명 등을 수정할 수 있습니다. 휴대폰 번호가 바뀐 경우에는 서비스 내 설정 메뉴나 고객센터 문의를 통해 새 휴대폰 본인인증 절차를 걸쳐 수정할 수 있....`,
  },
  {
    title: "피그마 어떻게 써요",
    body: `당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 
다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다. 
또한, 한 개의 휴대폰 번호로 계정 1개만 생성할 수 있으며, CI 기준으로는 최대 3개의 계정을 만들 수 있습니다. 
아래의 경우에는 계정 생성 및 로그인을 승인하지 않을 수 있습니다.
계정은 본인만 이용할 수 있고, 다른 사람에게 이용을 허락하거나 양도할 수 없는 것이 원칙입니다. 사용자는 계정과 관련된 정보, 즉 프로필 사진이나 별명 등을 수정할 수 있습니다. 휴대폰 번호가 바뀐 경우에는 서비스 내 설정 메뉴나 고객센터 문의를 통해 새 휴대폰 본인인증 절차를 걸쳐 수정할 수 있....`,
  },
  {
    title: "피그마 어떻게 써요",
    body: `당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 
다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다. 
또한, 한 개의 휴대폰 번호로 계정 1개만 생성할 수 있으며, CI 기준으로는 최대 3개의 계정을 만들 수 있습니다. 
아래의 경우에는 계정 생성 및 로그인을 승인하지 않을 수 있습니다.
계정은 본인만 이용할 수 있고, 다른 사람에게 이용을 허락하거나 양도할 수 없는 것이 원칙입니다. 사용자는 계정과 관련된 정보, 즉 프로필 사진이나 별명 등을 수정할 수 있습니다. 휴대폰 번호가 바뀐 경우에는 서비스 내 설정 메뉴나 고객센터 문의를 통해 새 휴대폰 본인인증 절차를 걸쳐 수정할 수 있....`,
  },
  {
    title: "피그마 어떻게 써요",
    body: `당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 
다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다. 
또한, 한 개의 휴대폰 번호로 계정 1개만 생성할 수 있으며, CI 기준으로는 최대 3개의 계정을 만들 수 있습니다. 
아래의 경우에는 계정 생성 및 로그인을 승인하지 않을 수 있습니다.
계정은 본인만 이용할 수 있고, 다른 사람에게 이용을 허락하거나 양도할 수 없는 것이 원칙입니다. 사용자는 계정과 관련된 정보, 즉 프로필 사진이나 별명 등을 수정할 수 있습니다. 휴대폰 번호가 바뀐 경우에는 서비스 내 설정 메뉴나 고객센터 문의를 통해 새 휴대폰 본인인증 절차를 걸쳐 수정할 수 있....`,
  },
];

const TeamBoardToggle: React.FC = () => {
  // 각 항목의 열림 상태를 관리
  const [isItemExpandedMap, setIsItemExpandedMap] = useState<
    Record<number, boolean>
  >({});

  // 토글 핸들러
  const handleToggleItem = (idx: number): void => {
    // idx에 해당하는 것만 반전시킴
    setIsItemExpandedMap(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="max-w-[1420px] mx-auto font-sans flex flex-col gap-10">
      {/* 헤더 & 타이틀 */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="py-1 px-2 bg-main rounded-[30px] flex items-center">
              <span className="text-detail1 text-white">
                경영기획 그룹 / ICT 기획
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-heading1 font-bold text-gray-80">
              Core 개발 2부팀
            </h1>
            <Users className="w-8 h-8 text-gray-40" />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="h-16 px-6 rounded-[15px] border border-gray-20 flex items-center gap-4 bg-white text-heading3 text-gray-80"
          >
            <Upload className="w-4 h-4 text-gray-60" />
            Export
          </button>
          <button
            type="button"
            className="h-16 px-6 rounded-[15px] bg-main flex items-center gap-4 text-heading3 text-white"
          >
            <Pen className="w-4 h-4 text-white" />
            문의 작성
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl">
        {/* 필터 */}
        <div className="flex h-16 justify-end items-center border-b border-gray-10 pr-8">
          <div className="flex items-center px-4 gap-2">
            <Loader className="w-5 h-5 text-gray-60" />
            <span className="text-body1 text-gray-60">문의 상태</span>
            <span className="w-6 h-6 flex justify-center items-center">
              <Arrow className="w-[14px] h-[8px] text-gray-50" />
            </span>
          </div>
          <div className="flex items-center px-4 gap-2">
            <Clock className="w-5 h-5 text-gray-40" />
            <span className="text-body1 text-gray-60">문의 일시(전체)</span>
            <span className="w-6 h-6 flex justify-center items-center">
              <Arrow className="w-[14px] h-[8px] text-gray-50" />
            </span>
          </div>
        </div>

        {/* 질문 리스트 */}
        <ul>
          {mockQuestions.map((q, idx) => {
            const isOpen = !!isItemExpandedMap[idx];
            return (
              <li
                key={idx}
                className="border-b border-gray-10 flex flex-col items-center pr-10 pl-4"
              >
                <button
                  type="button"
                  onClick={() => handleToggleItem(idx)}
                  className="flex items-center h-20 w-full py-6 focus:outline-none"
                >
                  <Star className="w-5 h-5 text-gray-30 mr-10" />
                  <span className="text-body1 text-gray-80">{q.title}</span>
                  <Arrow
                    className={
                      "w-[14px] h-[8px] ml-auto transform transition-transform " +
                      (isOpen
                        ? "rotate-180 text-gray-100"
                        : "rotate-0 text-gray-30")
                    }
                  />
                </button>
                {isOpen && (
                  <div className="pl-9 pb-6 w-full">
                    <div className="px-9 py-8 bg-gray-10 rounded-2xl text-gray-80 text-body2 flex flex-col gap-6">
                      <p>{q.body}</p>
                      <button className="mx-auto text-body2 text-gray-60 p-2 flex gap-4 items-center">
                        자세히
                        <DoubleArrow className="w-14px h-12px text-gray-40" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-2">
        <button
          type="button"
          disabled
          className="text-detail1 text-gray-50 disabled:opacity-50"
        >
          <Arrow className="w-[20px] h-[11px] text-gray-40 rotate-90" />
        </button>
        <button className="w-[38px] h-[38px] border-2 border-main text-main rounded-[5px] bg-white text-body1">
          1
        </button>
        <button className="w-[38px] h-[38px] border-1 border-gray-50 text-gray-60 rounded-[5px] bg-white  text-body1">
          2
        </button>
        <button
          type="button"
          className="text-detail1 text-gray-50 disabled:opacity-50"
        >
          <Arrow className="w-[20px] h-[11px] text-gray-50 -rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default TeamBoardToggle;
