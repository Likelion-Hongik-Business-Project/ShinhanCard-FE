import { useEffect, useState } from "react";

import HomeMain from "@/components/Home/HomeMain";
import HomeProfile from "@/components/Home/HomeProfile";

import homepageData from "@/mocks/home/homepageData.json";

interface HomeData {
  id: number;
  name: string;
  profile_image_url: string;
  answer_count: number;
  inquiry_count: number;
  interest_count: number;
}

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
