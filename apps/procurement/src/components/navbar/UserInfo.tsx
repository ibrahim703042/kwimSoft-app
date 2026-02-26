import { UserInfo as SharedUserInfo } from "@kwim/shared-ui";
import profile from "../../assets/img/users/avatar.png";

const UserInfo = () => {
  return (
    <SharedUserInfo
      fullName="HR User"
      email="hr@kwimsoft.com"
      avatar={profile}
    />
  );
};

export default UserInfo;
