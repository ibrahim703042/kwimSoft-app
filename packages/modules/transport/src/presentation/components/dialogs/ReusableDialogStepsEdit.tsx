import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@kwim/shared-ui";

interface ReusableDialogStepsEditProps {
  readonly dialogTitle: string;
  readonly children: ReactNode;
  readonly openDialog: boolean;
  readonly setOpenDialog: (open: boolean) => void;
}

export default function ReusableDialogStepsEdit({
  dialogTitle,
  children,
  openDialog,
  setOpenDialog,
}: ReusableDialogStepsEditProps) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-medium">{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-0">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
