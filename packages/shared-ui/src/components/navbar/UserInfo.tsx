import React from "react";
import { User } from "lucide-react";

interface UserInfoProps {
  fullName?: string;
  email?: string;
  avatar?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ fullName, email, avatar }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="h-7 w-7">
        {avatar ? (
          <img
            src={avatar}
            alt="User"
            className="rounded-full border border-gray-300 shadow-md"
          />
        ) : (
          <div className="h-7 w-7 rounded-full border border-gray-300 shadow-md bg-muted flex items-center justify-center">
            <User size={14} className="text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="text-xs text-gray-700 dark:text-gray-200">
        <p className="font-medium text-[0.7rem] leading-tight">{fullName || "User"}</p>
        <p className="text-[0.7rem] text-center leading-tight">{email || ""}</p>
      </div>
    </div>
  );
};

export default UserInfo;
