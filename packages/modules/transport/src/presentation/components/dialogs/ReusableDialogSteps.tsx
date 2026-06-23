import { Plus } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kwim/shared-ui";

interface ReusableDialogStepsProps {
  readonly dialogTitle: string;
  readonly children: React.ReactNode;
  readonly openDialog: boolean;
  readonly setOpenDialog: (open: boolean) => void;
  readonly handleModalOpen?: () => void;
}

export default function ReusableDialogSteps({
  dialogTitle,
  children,
  openDialog,
  setOpenDialog,
  handleModalOpen,
}: ReusableDialogStepsProps) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="icon"
          className="h-9 w-9"
          onClick={handleModalOpen}
          aria-label={dialogTitle}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-medium">{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-0">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
