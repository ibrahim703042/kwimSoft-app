import { UseFormReturn } from "react-hook-form";
import {
  Input,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Checkbox,
} from "@kwim/shared-ui";
import { Plus, Trash2 } from "lucide-react";
import type { EmployeeFormValues, AssignedLeave } from "../employee.schema";

const LEAVE_TYPE_OPTIONS = [
  { value: "annual", label: "Congé annuel" },
  { value: "sick", label: "Congé maladie" },
  { value: "maternity", label: "Congé maternité" },
  { value: "paternity", label: "Congé paternité" },
  { value: "unpaid", label: "Sans solde" },
  { value: "compensatory", label: "Repos compensatoire" },
  { value: "other", label: "Autre" },
];

export function LeaveDetailTab({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
  const assignedLeaves = form.watch("assignedLeaves") ?? [];

  const appendRow = () => {
    form.setValue("assignedLeaves", [
      ...assignedLeaves,
      { leaveType: "annual", days: 0, isActive: true },
    ]);
  };

  const removeRow = (index: number) => {
    form.setValue(
      "assignedLeaves",
      assignedLeaves.filter((_, i) => i !== index)
    );
  };

  const updateRow = (index: number, field: keyof AssignedLeave, value: string | number | boolean) => {
    const next = [...assignedLeaves];
    (next[index] as Record<string, unknown>)[field] = value;
    form.setValue("assignedLeaves", next);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="leaveAllocated"
        render={({ field }) => (
          <FormItem className="max-w-xs">
            <FormLabel>Congés alloués (jours)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                {...field}
                value={field.value ?? 0}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <FormLabel>Congés assignés</FormLabel>
          <Button type="button" variant="outline" size="sm" onClick={appendRow}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type de congé</TableHead>
                <TableHead>Nbre de jours</TableHead>
                <TableHead>Actif</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-6">
                    Aucun congé assigné. Cliquez sur Ajouter.
                  </TableCell>
                </TableRow>
              ) : (
                assignedLeaves.map((row: AssignedLeave, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <select
                        className="w-full border rounded px-2 py-1.5 text-sm bg-background"
                        value={row.leaveType}
                        onChange={(e) => updateRow(index, "leaveType", e.target.value)}
                      >
                        {LEAVE_TYPE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        className="w-20"
                        value={row.days}
                        onChange={(e) =>
                          updateRow(index, "days", e.target.value ? Number(e.target.value) : 0)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={row.isActive}
                        onCheckedChange={(c) => updateRow(index, "isActive", !!c)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeRow(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
