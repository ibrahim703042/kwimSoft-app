import React from "react";
import profile from "../../assets/img/users/avatar.png";
import { useUserData } from "../../hooks/useUserData";

const UserInfo: React.FC = () => {
  const { data } = useUserData();

  return (
    <div className="flex items-center gap-1">
      <div className="h-7 w-7">
        <img src={profile} alt="User" className="rounded-full border border-gray-300 shadow-md" />
      </div>
      <div className="text-xs text-gray-700 dark:text-gray-200">
        <p className="font-medium text-[0.7rem] leading-tight">{data?.fullName}</p>
        <p className="text-[0.7rem] text-center leading-tight">{data?.email}</p>
      </div>
    </div>
  );
};

export default UserInfo;
