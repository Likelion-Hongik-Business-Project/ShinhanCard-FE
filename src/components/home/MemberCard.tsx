import { useState } from "react";

import { useNavigate } from "react-router-dom";

import FilledHeart from "@/assets/svgs/common/heart-active.svg";
import profileFallbackUrl from "@/assets/svgs/common/profile.svg?url";
import User from "@/assets/svgs/home/icon-user.svg";
import Modal from "@/components/common/Modal";
import { useRemoveInterestedMember } from "@/hooks/home/useHomeMemberApi";
import { InterestedMember } from "@/types/home/homeApi.type";

type Props = {
  member: InterestedMember;
};

const MemberCard = ({ member }: Props) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: removeInterestedMember } = useRemoveInterestedMember();
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    removeInterestedMember(member.member_id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  };

  // 스페이스 방문하기 버튼 클릭 핸들러
  const handleVisitSpace = () => {
    navigate(`/space/${encodeURIComponent(member.member_id)}`);
  };

  const profileSrc = member.profile_image_url?.trim()
    ? member.profile_image_url.trim()
    : profileFallbackUrl;

  return (
    <>
      <div className="w-full h-full flex flex-col bg-white rounded-[15px] shadow-[0_4px_4px_0_rgba(0,0,0,0.10)] p-6">
        <div className="flex justify-end w-full">
          <FilledHeart
            className="w-6 h-6 cursor-pointer"
            onClick={() => setIsDeleteModalOpen(true)}
          />
        </div>
        <div className="flex justify-center w-full mb-6">
          <img
            src={profileSrc}
            alt={member.name}
            className="w-20 h-20 rounded-full object-cover"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = profileFallbackUrl;
            }}
          />
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="text-heading3-sb mb-2">{member.name}</div>
          <div className="text-detail1 text-gray-80 mb-1">
            {member.team_name}
          </div>
          <div className="text-detail3 text-gray-60">
            {member.group_name} 그룹 &gt; {member.division_name}
          </div>
        </div>
        <button
          className="w-60 h-10 px-3 flex items-center justify-center gap-4 border border-gray-20 rounded-[12px] bg-white text-detail1 text-gray-80 mx-auto cursor-pointer"
          onClick={handleVisitSpace}
        >
          <User className="w-4 h-4" />
          {member.name}님 스페이스 방문하기
        </button>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="관심팀원을 삭제하시겠어요?"
        description="관심 팀원을 삭제하면 목록에서 제외됩니다."
        buttons={[
          {
            type: "white",
            label: "취소",
            onClick: () => setIsDeleteModalOpen(false),
          },
          {
            type: "blue",
            label: "삭제하기",
            onClick: handleDeleteClick,
          },
        ]}
      />
    </>
  );
};

export default MemberCard;
