import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import PropTypes from "prop-types";
import { Plus } from "lucide-react";

interface ReusableDialogStepsProps {
  dialogTitle: string;
  children: React.ReactNode;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  handleModalOpen?: () => void;
  step: number; 
  setStep: (step: number) => void; 
}

export default function ReusableDialogSteps({
  dialogTitle,
  children,
  openDialog,
  setOpenDialog,
  handleModalOpen,
  step,
  setStep, 
}: ReusableDialogStepsProps) {
  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <div>
            <div
              className="bg-[#191C21] py-[10px] px-[10px] rounded-md cursor-pointer"
              onClick={handleModalOpen}
            >
              <Plus className="text-white" size="17" />
            </div>
          </div>
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

// Définition des props et des valeurs par défaut
ReusableDialogSteps.propTypes = {
  dialogTitle: PropTypes.string.isRequired,
  dialogDescription: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  footerButtons: PropTypes.node,
  step: PropTypes.number.isRequired, 
  setStep: PropTypes.func.isRequired,
};

ReusableDialogSteps.defaultProps = {
  dialogDescription: "",
  children: null,
  onSubmit: () => { },
  footerButtons: null,
};
