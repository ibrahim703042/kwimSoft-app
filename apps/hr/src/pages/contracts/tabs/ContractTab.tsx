import { UseFormReturn } from "react-hook-form";
import {
  Input,
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
import type { ContractFormValues } from "../contract.schema";

const CONTRACT_TYPES = [
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
  { value: "interim", label: "Intérim" },
  { value: "stage", label: "Stage" },
  { value: "freelance", label: "Freelance" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Brouillon" },
  { value: "active", label: "Actif" },
  { value: "expired", label: "Expiré" },
  { value: "terminated", label: "Résilié" },
];

interface ContractTabProps {
  form: UseFormReturn<ContractFormValues>;
  employees: { _id: string; firstName: string; lastName: string }[];
}

export function ContractTab({ form, employees }: ContractTabProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="reference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Référence</FormLabel>
            <FormControl>
              <Input placeholder="ex: CTR-2026-001" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
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
            <FormLabel>Type</FormLabel>
            <Select value={field.value || "cdi"} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CONTRACT_TYPES.map((t) => (
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
            <Select value={field.value || "draft"} onValueChange={field.onChange}>
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
