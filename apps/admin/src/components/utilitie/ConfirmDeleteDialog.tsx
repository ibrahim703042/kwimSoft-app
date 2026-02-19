import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  /** Optional item name to show in the message (e.g. "cette station") */
  itemName?: string;
}

const defaultTitle = "Confirmer la suppression";
const defaultDescription = "Cette action est irréversible. Voulez-vous vraiment continuer ?";
const defaultConfirmLabel = "Supprimer";
const defaultCancelLabel = "Annuler";

/**
 * Reusable confirmation dialog before delete.
 * Control visibility with `open` / `onOpenChange`, and run delete in `onConfirm`.
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title = defaultTitle,
  description = defaultDescription,
  confirmLabel = defaultConfirmLabel,
  cancelLabel = defaultCancelLabel,
  onConfirm,
  isLoading = false,
  itemName,
}: ConfirmDeleteDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  const message = itemName
    ? `Voulez-vous vraiment supprimer ${itemName} ? Cette action est irréversible.`
    : description;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Suppression..." : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
