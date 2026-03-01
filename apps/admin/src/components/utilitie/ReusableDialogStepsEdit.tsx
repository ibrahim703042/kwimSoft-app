import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ReusableDialogStepsEditProps {
  dialogTitle: string;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  children: ReactNode;
}

export default function ReusableDialogStepsEdit({
  dialogTitle,
  openDialog,
  setOpenDialog,
  children,
}: ReusableDialogStepsEditProps) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
