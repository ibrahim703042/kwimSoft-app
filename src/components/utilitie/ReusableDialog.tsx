import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import { Eye} from "lucide-react";

interface ReusableDialogProps {
  triggerText?: string;
  dialogTitle: string;
  children: ReactNode;
  onSubmit?: () => void;
  footerButtons?: ReactNode;
  buttonDescr?: string;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  handleModalOpen?: () => void;
}

export default function ReusableDialog({
  dialogTitle,
  children,
  footerButtons,
  openDialog,
  setOpenDialog,
  handleModalOpen,
}: ReusableDialogProps) {
  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <div>
            <div
              className="bg-[#e8e8e8] p-2 py-3 px-3 rounded-md mt-1  cursor-pointer"
              onClick={handleModalOpen}
            >
              <Eye size={16} />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-medium">{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-0">{children}</div>
          <DialogFooter>
            {footerButtons ? (
              footerButtons
            ) : (
               <div>

               </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
