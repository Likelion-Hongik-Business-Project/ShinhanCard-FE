export default function HomeProfile({
  name,
  profileImage,
}: {
  name: string;
  profileImage: string;
}) {
  return (
    <div className="flex flex-col items-center mb-[24px]">
      <img
        src={profileImage}
        alt="프로필 이미지"
        className="w-[120px] h-[120px] rounded-full object-cover mb-[24px]"
      />
      <p
        className="text-[var(--text-heading1)] font-bold leading-[120%]"
        style={{ width: "auto" }}
      >
        {name}님 안녕하세요
      </p>
    </div>
  );
}
