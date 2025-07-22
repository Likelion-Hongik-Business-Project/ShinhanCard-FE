import { useEffect, useState } from "react";

import HomeMain from "@/components/Home/HomeMain";
import HomeProfile from "@/components/Home/HomeProfile";

import homepageData from "@/mocks/homepageData.json";

interface HomeData {
  id: number;
  name: string;
  profile_image_url: string;
  answer_count: number;
  inquiry_count: number;
  interest_count: number;
  interest_member: Array<{
    name: string;
    team_id: string;
    group_name: string;
    division_name: string;
    team_name: string;
    profile_image_url: string;
  }>;
}

const HomePage = () => {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    setData(homepageData);
  }, []);

  if (!data) return null;

  return (
    <section className="w-full h-[835px] bg-gray-50">
      <div className="w-full">
        <HomeProfile name={data.name} profileImage={data.profile_image_url} />
        <HomeMain
          answerCount={data.answer_count}
          inquiryCount={data.inquiry_count}
          interestCount={data.interest_count}
          interestMember={data.interest_member}
        />
      </div>
    </section>
  );
};

export default HomePage;
