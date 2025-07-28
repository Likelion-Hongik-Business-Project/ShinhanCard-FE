import { useEffect, useState } from "react";

import HomeMain from "@/components/home/HomeMain";
import HomeProfile from "@/components/home/HomeProfile";
import { HomeData } from "@/types/home";

import { homepageData } from "@/mocks/home";

const HomePage = () => {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    setData(homepageData);
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
