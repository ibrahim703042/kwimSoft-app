import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarFold } from "lucide-react";

export interface ReusableDialogCalandarProps {
  triggerText: string;
  dialogTitle: string;
  children?: ReactNode;
  onSubmit?: () => void;
  footerButtons?: ReactNode;
  buttonDescr?: string;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  handleModalOpen?: () => void;
}

export default function ReusableDialogCalandar({
  triggerText,
  dialogTitle,
  children = null,
  onSubmit = () => {},
  footerButtons = null,
  buttonDescr,
  openDialog,
  setOpenDialog,
  handleModalOpen,
}: ReusableDialogCalandarProps) {
  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <div>
            <div
              className="bg-[#191C21] rounded-md cursor-pointer"
              onClick={handleModalOpen}
            >
              <Button className="text-[0.8rem]">
                <CalendarFold className="text-[#ffffffbd]" size={17} />
                <span className="text-[0.8rem] font-medium">Horaire</span>
              </Button>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="font-medium">{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-0">{children}</div>

          <DialogFooter>
            {footerButtons ? (
              footerButtons
            ) : (
              <Button
                type="submit"
                onClick={onSubmit}
                className="py-0 px-7 text-[0.7rem]"
              >
                {buttonDescr}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
