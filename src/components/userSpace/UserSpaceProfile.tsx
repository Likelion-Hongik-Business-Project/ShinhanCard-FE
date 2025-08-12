import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Heart from "@/assets/svgs/common/heart.svg";
import HeartActive from "@/assets/svgs/common/heart-active.svg";
import profileFallbackUrl from "@/assets/svgs/common/profile.svg?url";
import Pencil from "@/assets/svgs/layout/pencil.svg";
import Button from "@/components/common/Button";
import { GetProfileResponse } from "@/types/profile/profileApi.type";

import api from "@/apis/instance";

interface InterestedMember {
  member_id: number;
  name: string;
  phone_number: string;
  group_name: string;
  division_name: string;
  team_name: string;
  profile_image_url: string;
}

interface Props {
  userId: number;
  profile: GetProfileResponse;
}

export default function UserSpaceProfile({ userId, profile }: Props) {
  const [isHearted, setIsHearted] = useState(false);
  const navigate = useNavigate();

  // 관심 여부 불러오기
  const checkIsInterested = async () => {
    try {
      const res = await api.get("/api/home/interested");
      const members: InterestedMember[] =
        res.data?.result?.interested_members ?? [];
      const isInterested = members.some(member => member.member_id === userId);
      setIsHearted(isInterested);
    } catch (err) {
      console.error("관심 팀원 여부 확인 실패:", err);
    }
  };

  // 관심 추가/삭제
  const toggleHeart = async () => {
    try {
      if (isHearted) {
        await api.delete(`/api/home/interested/${userId}`);
        setIsHearted(false);
      } else {
        await api.post(`/api/home/interested/${userId}`);
        setIsHearted(true);
      }
    } catch (err) {
      console.error("관심 등록/해제 실패:", err);
    }
  };

  useEffect(() => {
    checkIsInterested();
  }, [userId]);

  const profileSrc = profile.profile_image_url?.trim()
    ? profile.profile_image_url.trim()
    : profileFallbackUrl;

  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="w-40 h-40 rounded-full overflow-hidden relative shrink-0">
        <img
          src={profileSrc}
          alt="프로필 이미지"
          className="w-full h-full object-cover"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = profileFallbackUrl;
          }}
        />
      </div>

      <div className="pl-10 flex-1 min-w-[180px]">
        <h1 className="text-heading1 text-black whitespace-nowrap">
          {profile.name}님의 스페이스
        </h1>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-heading3-sb text-main">
            {profile.team_name}
          </span>
          <span className="text-body2 text-gray-60 whitespace-nowrap">
            {profile.group_name} &gt; {profile.division_name}
          </span>
        </div>
      </div>

      <div className="flex gap-4 ml-auto">
        <Button
          buttonType="blue"
          className="flex items-center gap-2 whitespace-nowrap px-4 py-3"
          onClick={() =>
            navigate("/inquiry/form", { state: { toUserId: profile.id } })
          }
        >
          <Pencil className="w-4 h-4 text-white" />
          <span className="text-heading3 text-white">
            {profile.name}님에게 문의 작성
          </span>
        </Button>

        <Button buttonType="white" onClick={toggleHeart}>
          {isHearted ? (
            <HeartActive className="w-[24px] h-[24px] aspect-square" />
          ) : (
            <Heart className="w-[24px] h-[24px] aspect-square" />
          )}
        </Button>
      </div>
    </div>
  );
}
