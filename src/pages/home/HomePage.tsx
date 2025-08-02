import { useEffect, useState } from "react";

import HomeMain from "@/components/home/HomeMain";
import HomeProfile from "@/components/home/HomeProfile";
import { HomeData } from "@/types/home";
import { MOCK_HOME_INITIAL_RESPONSE } from "@/mocks/home";

const HomePage = () => {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    // API 응답 형식에서 HomeData 형식으로 변환
    const homeData: HomeData = {
      id: MOCK_HOME_INITIAL_RESPONSE.writer.id,
      name: MOCK_HOME_INITIAL_RESPONSE.writer.name,
      profile_image_url: MOCK_HOME_INITIAL_RESPONSE.writer.profile_image_url,
      answer_count: MOCK_HOME_INITIAL_RESPONSE.total_unchecked_answer_count,
      inquiry_count: MOCK_HOME_INITIAL_RESPONSE.total_unchecked_inquiries_count,
      interest_count: MOCK_HOME_INITIAL_RESPONSE.interest_count,
    };
    setData(homeData);
  }, []);

  if (!data) return null;

  return (
    <section className="w-full h-auto bg-gray-10">
      <div className="w-full">
        <HomeProfile name={data.name} profileImage={data.profile_image_url} />
        <HomeMain
          answerCount={data.answer_count}
          inquiryCount={data.inquiry_count}
          interestCount={data.interest_count}
        />
      </div>
    </section>
  );
};

export default HomePage;
