export default function HomeProfile({
  name,
  profileImage,
}: {
  name: string;
  profileImage: string;
}) {
  return (
    <div className="flex flex-col items-center pb-20">
      <img
        src={profileImage}
        alt="프로필 이미지"
        className="w-[120px] h-[120px] rounded-full object-cover mb-[24px]"
      />
      <p className="text-heading1 w-full text-gary-80 text-center">
        {name} 님 안녕하세요
      </p>
    </div>
  );
}
