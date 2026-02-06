import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface ReusableDialogStepsEditProps {
  dialogTitle: string;
  children: ReactNode;
  onSubmit?: () => void;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  handleModalOpen?: () => void;
}

export default function ReusableDialogStepsEdit({
  dialogTitle,
  children,
  openDialog,
  setOpenDialog,
}: ReusableDialogStepsEditProps) {
  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
         
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="font-medium">{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-0">{children}</div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
