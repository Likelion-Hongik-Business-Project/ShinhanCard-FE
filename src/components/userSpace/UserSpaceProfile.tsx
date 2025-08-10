import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Heart from "@/assets/svgs/common/heart.svg";
import HeartActive from "@/assets/svgs/common/heart-active.svg";
import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import Pencil from "@/assets/svgs/layout/pencil.svg";
import Button from "@/components/common/Button";

import api from "@/apis/instance";

interface UserProfile {
  id: number;
  name: string;
  group_name: string;
  division_name: string;
  team_id: number;
  team_name: string;
  email: string;
  phone_number: string;
  profile_image_url: string;
}

interface InterestedMember {
  member_id: number;
  name: string;
  phone_number: string;
  group_name: string;
  division_name: string;
  team_name: string;
  profile_image_url: string;
}

export default function UserSpaceProfile({ userId }: { userId: number }) {
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [isHearted, setIsHearted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  // 유저 정보 불러오기
  const getUserInfo = async () => {
    try {
      const res = await api.get(`/api/profile/preview/${userId}`);

      if (res.data?.is_success && res.data.result) {
        setUserInfo(res.data.result);
      } else {
        setErrorMsg(
          res.data?.message || "유저 정보를 불러오는 데 실패했습니다."
        );
      }
    } catch (error) {
      console.error("유저 정보 불러오기 에러:", error);
      setErrorMsg("유저 정보 불러오기 중 에러가 발생했습니다.");
    }
  };

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
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getUserInfo(), checkIsInterested()]);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  if (!userInfo) return <div>유저 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="w-40 h-40 rounded-full overflow-hidden relative shrink-0">
        {userInfo.profile_image_url ? (
          <img
            src={userInfo.profile_image_url}
            alt="프로필 이미지"
            className="w-full h-full object-cover"
          />
        ) : (
          <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
        )}
      </div>

      <div className="pl-10 flex-1 min-w-[180px]">
        <h1 className="text-heading1 text-black whitespace-nowrap">
          {userInfo.name}님의 스페이스
        </h1>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-heading3-sb text-main">
            {userInfo.team_name}
          </span>
          <span className="text-body2 text-gray-60 whitespace-nowrap">
            {userInfo.group_name} &gt; {userInfo.division_name}
          </span>
        </div>
      </div>

      <div className="flex gap-4 ml-auto">
        <Button
          buttonType="blue"
          className="flex items-center gap-2 whitespace-nowrap px-4 py-3"
          onClick={() =>
            navigate("/inquiry/form", { state: { toUserId: userInfo.id } })
          }
        >
          <Pencil className="w-4 h-4 text-white" />
          <span className="text-heading3 text-white">
            {userInfo.name}님에게 문의 작성
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
