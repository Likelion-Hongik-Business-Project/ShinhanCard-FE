import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import HomeMain from "@/components/home/HomeMain";
import HomeProfile from "@/components/home/HomeProfile";
import { useHomeInitial } from "@/hooks/home/useHomeApi";
import { useProfile } from "@/hooks/profile/useProfile";

import { useProfileStore } from "@/store/useProfileStore";

const HomePage = () => {
  const queryClient = useQueryClient();

  // useProfile 훅 실행 (로직만 실행, 데이터는 반환하지 않음)
  useProfile();

  // 홈페이지 초기 데이터 조회
  const { data: homeInitialData, isLoading, error } = useHomeInitial();

  // store에서 profile 데이터 직접 가져오기
  const { profile } = useProfileStore();

  // 홈페이지에 라우팅될 때마다 홈페이지 데이터 새로 가져오기
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["home"] });
  }, [queryClient]);

  // 로딩 중이거나 에러가 있거나 데이터가 없으면 로딩 스피너 또는 null 반환
  if (isLoading) {
    return <LoadingSpinner fullscreen={true} />;
  }
  if (error || !homeInitialData?.result) return null;

  const homeData = homeInitialData.result;

  return (
    <section className="w-full h-auto bg-gray-10">
      <div className="w-full">
        <HomeProfile
          name={profile?.name || homeData.writer.name}
          profileImage={
            profile?.profile_image_url || homeData.writer.profile_image_url
          }
        />
        <HomeMain
          answerCount={homeData.total_unchecked_answer_count}
          inquiryCount={homeData.total_unchecked_inquries_count}
          interestCount={homeData.interest_count}
          homeInitialData={homeData}
        />
      </div>
    </section>
  );
};

export default HomePage;
