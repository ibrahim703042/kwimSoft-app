import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@kwim/shared-ui";

interface Driver {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  licenseNumber?: string;
  adresse?: string;
  company?: { name: string };
}

interface ViewDriverProps {
  readonly driver: Driver;
  readonly onClose: () => void;
}

export default function ViewDriver({ driver, onClose }: ViewDriverProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{driver.fullName}</DialogTitle>
        </DialogHeader>
        <dl className="space-y-2 text-sm">
          <div><dt className="text-muted-foreground">Email</dt><dd>{driver.email}</dd></div>
          <div><dt className="text-muted-foreground">Téléphone</dt><dd>{driver.phoneNumber}</dd></div>
          <div><dt className="text-muted-foreground">Permis</dt><dd>{driver.licenseNumber || "—"}</dd></div>
          <div><dt className="text-muted-foreground">Compagnie</dt><dd>{driver.company?.name || "—"}</dd></div>
          <div><dt className="text-muted-foreground">Adresse</dt><dd>{driver.adresse || "—"}</dd></div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
