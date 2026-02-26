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
import type { EmployeeFormValues } from "../employee.schema";

const ACCOUNT_TYPE_OPTIONS = [
  { value: "savings", label: "Épargne" },
  { value: "current", label: "Courant" },
  { value: "salary", label: "Compte salaire" },
];

export function BankDetailTab({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="bankName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de la banque *</FormLabel>
            <FormControl>
              <Input placeholder="Nom de la banque" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bankAccountNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>N° de compte *</FormLabel>
            <FormControl>
              <Input placeholder="N° de compte bancaire" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="accountHolderName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titulaire du compte *</FormLabel>
            <FormControl>
              <Input placeholder="Nom du titulaire" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bankAccountType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de compte *</FormLabel>
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ACCOUNT_TYPE_OPTIONS.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
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
