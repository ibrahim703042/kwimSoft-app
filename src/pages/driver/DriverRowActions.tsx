import { ClipboardPen, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DriverRecord } from "@/domains/fleet/types";

interface DriverRowActionsProps {
  row: DriverRecord;
  onEdit: (row: DriverRecord) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DriverRowActions({
  row,
  onEdit,
  onView,
  onDelete,
}: Readonly<DriverRowActionsProps>) {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="sm"
              className="p-2"
              onClick={() => onEdit(row)}
            >
              <ClipboardPen size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="p-2"
              onClick={() => onView(row._id)}
            >
              <Eye size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Voir le détail</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="p-2"
              onClick={() => onDelete(row._id)}
            >
              <Trash2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Supprimer</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
