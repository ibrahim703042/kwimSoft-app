import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PropTypes from "prop-types";
import { Eye} from "lucide-react";

export default function ReusableDialog({
  triggerText,
  dialogTitle,
  children,
  onSubmit,
  footerButtons,
  buttonDescr,
  openDialog,
  setOpenDialog,
  handleModalOpen,
}) {
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

// Définition des props et des valeurs par défaut
ReusableDialog.propTypes = {
  triggerText: PropTypes.string.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  dialogDescription: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  footerButtons: PropTypes.node,
};

ReusableDialog.defaultProps = {
  dialogDescription: "",
  children: null,
  onSubmit: () => { },
  footerButtons: null,
};
