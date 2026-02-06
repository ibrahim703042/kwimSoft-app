import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PropTypes from "prop-types";
import { CalendarFold } from "lucide-react";

export default function ReusableDialogCalandar({
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
              className="bg-[#191C21] rounded-md cursor-pointer"
              onClick={handleModalOpen}
            >
              <Button className="text-[0.8rem]">
                <CalendarFold className="text-[#ffffffbd]" size="17" />
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

// Définition des props et des valeurs par défaut
ReusableDialogCalandar.propTypes = {
  triggerText: PropTypes.string.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  dialogDescription: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  footerButtons: PropTypes.node,
};

ReusableDialogCalandar.defaultProps = {
  dialogDescription: "",
  children: null,
  onSubmit: () => {},
  footerButtons: null,
};
