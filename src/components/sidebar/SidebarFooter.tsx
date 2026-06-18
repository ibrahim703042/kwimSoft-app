import profile from "../../assets/img/users/avatar.png";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useUserData } from "@/hooks/useUserData";

export default function SidebarFooter({ isOpen }: Readonly<{ isOpen: boolean }>) {
  const { t } = useTranslation();
  const { data: user } = useUserData();

  const displayName =
    user?.fullName ?? user?.username ?? "User";
  const email = user?.email ?? "";
  const role = user?.companyId?.name ?? t("sidebar.userManagement");

  return (
    <div className="mb-3">
      {isOpen ? (
        <div className="flex items-center justify-between space-x-2 rounded-md border border-[#90959e96] bg-[#0F123F] px-3 py-[5px]">
          <img src={profile} alt="" className="h-8 w-8 rounded-full" />
          <div className="min-w-0 flex-1 text-[0.7rem] text-[#b5bbc5]">
            <p className="truncate font-medium">{displayName}</p>
            <p className="truncate text-muted-foreground">{email}</p>
            <p className="truncate text-[0.65rem] text-primary-foreground/70">{role}</p>
          </div>
          <ThreeDotsVertical />
        </div>
      ) : (
        <img src={profile} alt="" className="hidden h-8 w-8 rounded-full md:block" />
      )}
    </div>
  );
}
