import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@kwim/shared-ui";
import type { LeaveFormValues } from "../leave.schema";

const LEAVE_TYPES = [
  { value: "annual", label: "Congé annuel" },
  { value: "sick", label: "Congé maladie" },
  { value: "maternity", label: "Congé maternité" },
  { value: "paternity", label: "Congé paternité" },
  { value: "unpaid", label: "Congé sans solde" },
  { value: "compensatory", label: "Repos compensatoire" },
  { value: "other", label: "Autre" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "approved", label: "Approuvé" },
  { value: "rejected", label: "Rejeté" },
  { value: "cancelled", label: "Annulé" },
];

interface RequestTabProps {
  form: UseFormReturn<LeaveFormValues>;
  employees: { _id: string; firstName: string; lastName: string }[];
}

export function RequestTab({ form, employees }: RequestTabProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="employee"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Employé</FormLabel>
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e._id} value={e._id}>
                    {e.firstName} {e.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de congé</FormLabel>
            <Select value={field.value || "annual"} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LEAVE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Statut</FormLabel>
            <Select value={field.value || "pending"} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}
