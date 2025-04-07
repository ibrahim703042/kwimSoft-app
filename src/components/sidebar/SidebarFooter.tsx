import profile from "../../assets/img/users/avatar.png";
import { ThreeDotsVertical } from "react-bootstrap-icons";

export default function SidebarFooter({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="mb-3">
      {isOpen ? (
        <div className="flex items-center justify-between bg-[#0F123F] space-x-2 px-3 py-[5px] rounded-md border-[#90959e96] border">
          <img src={profile} alt="" className="rounded-full w-8 h-8" />
          <div className="text-[#b5bbc5] text-[0.7rem]">
          <p className="font-medium">Kwizera Ibrahim</p>
          <p className="text-muted-foreground">kwizera.ibrahim@gmail.com</p>
          </div>
          <ThreeDotsVertical />
        </div>
      ) : (
        <img src={profile} alt="" className="rounded-full w-8 h-8 md:block hidden" />
      )}
    </div>
  );
}
