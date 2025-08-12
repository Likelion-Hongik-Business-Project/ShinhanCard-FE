import profileFallbackUrl from "@/assets/svgs/common/profile.svg?url";

type Props = {
  name: string;
  profileImage: string | null;
};

const HomeProfile = ({ name, profileImage }: Props) => {
  const profileSrc = profileImage?.trim()
    ? profileImage.trim()
    : profileFallbackUrl;

  return (
    <div className="flex flex-col items-center pb-20">
      <img
        src={profileSrc}
        alt="프로필 이미지"
        className="w-[120px] h-[120px] rounded-full object-cover mb-[24px]"
        onError={e => {
          const target = e.target as HTMLImageElement;
          target.src = profileFallbackUrl;
        }}
      />
      <p className="text-heading1 w-full text-gary-80 text-center">
        {name} 님 안녕하세요
      </p>
    </div>
  );
};

export default HomeProfile;
