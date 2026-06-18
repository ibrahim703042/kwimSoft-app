import { ClipboardPen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StationRow {
  _id: string;
}

interface StationRowActionsProps {
  row: StationRow;
  onEdit: (row: StationRow) => void;
  onDelete: (id: string) => void;
}

export default function StationRowActions({
  row,
  onEdit,
  onDelete,
}: Readonly<StationRowActionsProps>) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        size="sm"
        className="p-2"
        title="Modifier"
        onClick={() => onEdit(row)}
      >
        <ClipboardPen size={16} />
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="p-2"
        title="Supprimer"
        onClick={() => onDelete(row._id)}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
