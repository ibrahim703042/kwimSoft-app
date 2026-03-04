import { ReactNode, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  Loading,
  cn,
} from "@kwim/shared-ui";
import { Maximize2, Minimize2 } from "lucide-react";

interface CrudFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  children: ReactNode;
  submitText?: string;
  cancelText?: string;
  expandable?: boolean;
  wide?: boolean;
}

/**
 * Generic CRUD form dialog — Odoo-like with expand/collapse toggle
 */
export function CrudForm({
  open,
  onOpenChange,
  title,
  description,
  form,
  onSubmit,
  isLoading = false,
  children,
  submitText = "Save",
  cancelText = "Cancel",
  expandable = true,
  wide = false,
}: CrudFormProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "overflow-y-auto transition-all duration-200",
          expanded
            ? "!max-w-[95vw] !w-[95vw] !max-h-[95vh] !h-[95vh]"
            : wide
              ? "max-w-5xl max-h-[90vh]"
              : "max-w-3xl max-h-[90vh]"
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex-1">
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </div>
          {expandable && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? "Réduire" : "Agrandir"}
            >
              {expanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {children}

            <DialogFooter className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loading loading={true} size={20} />
                    <span>Enregistrement...</span>
                  </div>
                ) : (
                  submitText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
