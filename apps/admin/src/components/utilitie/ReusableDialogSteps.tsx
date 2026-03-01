import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ReusableDialogStepsProps {
  dialogTitle: string;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  children: ReactNode;
  triggerButtonText?: string;
  triggerButtonIcon?: ReactNode;
}

export default function ReusableDialogSteps({
  dialogTitle,
  openDialog,
  setOpenDialog,
  children,
  triggerButtonText = "Ajouter",
  triggerButtonIcon = <Plus size={16} />,
}: ReusableDialogStepsProps) {
  return (
    <>
      <Button
        onClick={() => setOpenDialog(true)}
        className="flex items-center gap-2"
        size="sm"
      >
        {triggerButtonIcon}
        {triggerButtonText}
      </Button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">{children}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
