import ProfileIcon from "@/assets/svgs/inquiry/profile.svg";
import { MOCK_USERS } from "@/constants/usersMock";

interface UserSearchListProps {
  users: typeof MOCK_USERS;
  onSelectUser: (user: (typeof MOCK_USERS)[0]) => void;
}

const UserSearchList = ({ users, onSelectUser }: UserSearchListProps) => (
  <div className="flex flex-col max-h-[249px] p-2">
    <span className="text-detail1 text-gray-50 mb-4">사용자를 선택하세요</span>
    <div className="flex flex-col max-h-50  overflow-y-auto scrollbar-hide">
      {users.map(user => (
        <div
          key={user.id}
          className="flex items-center gap-2 px-1 py-2 hover:bg-gray-10 cursor-pointer h-fit"
          onClick={() => onSelectUser(user)}
        >
          <ProfileIcon />
          <span className="text-body2 text-gray-100">{user.name}</span>
          <span className="text-detail1 text-gray-60">{user.dept}</span>
        </div>
      ))}
    </div>
  </div>
);

export default UserSearchList;
