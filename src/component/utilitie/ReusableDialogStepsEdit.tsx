import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import PropTypes from "prop-types";

export default function ReusableDialogStepsEdit({
  dialogTitle,
  children,
  onSubmit,
  openDialog,
  setOpenDialog,
  handleModalOpen,
}) {
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

// Définition des props et des valeurs par défaut
ReusableDialogStepsEdit.propTypes = {
  triggerText: PropTypes.string.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  dialogDescription: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  footerButtons: PropTypes.node,
};

ReusableDialogStepsEdit.defaultProps = {
  dialogDescription: "",
  children: null,
  onSubmit: () => { },
  footerButtons: null,
};
