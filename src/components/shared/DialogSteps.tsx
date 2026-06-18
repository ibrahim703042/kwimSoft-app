import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogStepsProps {
  dialogTitle: string;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  children: ReactNode;
  showTrigger?: boolean;
}

export default function ReusableDialogSteps({
  dialogTitle,
  openDialog,
  setOpenDialog,
  children,
  showTrigger = true,
}: Readonly<DialogStepsProps>) {
  return (
    <>
      {showTrigger && (
        <Button type="button" size="sm" onClick={() => setOpenDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      )}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ReusableDialogStepsEdit({
  dialogTitle,
  openDialog,
  setOpenDialog,
  children,
}: Readonly<DialogStepsProps>) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
