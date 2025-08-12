import ProfileIcon from "@/assets/svgs/common/profile.svg";

type Props = {
  name: string;
  profileImage: string | null;
};

const HomeProfile = ({ name, profileImage }: Props) => {
  return (
    <div className="flex flex-col items-center pb-20">
      {profileImage?.trim() ? (
        <img
          src={profileImage.trim()}
          alt="프로필 이미지"
          className="w-[120px] h-[120px] rounded-full object-cover mb-[24px]"
        />
      ) : (
        <ProfileIcon className="w-[120px] h-[120px] rounded-full mb-[24px]" />
      )}
      <p className="text-heading1 w-full text-gary-80 text-center">
        {name} 님 안녕하세요
      </p>
    </div>
  );
};

export default HomeProfile;
