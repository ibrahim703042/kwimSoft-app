import { UserInfo as SharedUserInfo } from "@kwim/shared-ui";
import { useUserData } from "@/hooks/useUserData";
import profile from "@/assets/img/users/avatar.png";

const UserInfo = () => {
  const { data } = useUserData();

  return (
    <SharedUserInfo
      fullName={data?.fullName}
      email={data?.email}
      avatar={profile}
    />
  );
};

export default UserInfo;
