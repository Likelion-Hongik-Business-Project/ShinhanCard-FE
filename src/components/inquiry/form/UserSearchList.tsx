import ProfileIcon from "@/assets/svgs/inquiry/profile.svg";
import { Member } from "@/types/team/user.type";

interface Props {
  users: Member[];
  onSelectUser: (user: Member) => void;
}

const UserSearchList = ({ users, onSelectUser }: Props) => (
  <div className="flex flex-col max-h-[249px] p-2">
    <span className="text-detail1 text-gray-50 mb-4">사용자를 선택하세요</span>
    <div className="flex flex-col max-h-50 overflow-y-auto scrollbar-hide">
      {users.map(user => (
        <div
          key={user.id}
          className="flex items-center gap-2 px-1 py-2 hover:bg-gray-10 cursor-pointer h-fit"
          onClick={() => onSelectUser(user)}
        >
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt="프로필 이미지"
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <ProfileIcon />
          )}
          <span className="text-body2 text-gray-100">{user.name}</span>
          <span className="text-detail1 text-gray-60">
            {user.group_name} / {user.division_name} / {user.team_name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default UserSearchList;
