import { UseFormReturn } from "react-hook-form";
import { Input, FormField, FormItem, FormLabel, FormControl } from "@kwim/shared-ui";
import type { EmployeeFormValues } from "../employee.schema";

export function EmergencyTab({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="emergencyContact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact d'urgence</FormLabel>
            <FormControl>
              <Input placeholder="Nom du contact" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="emergencyPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone d'urgence</FormLabel>
            <FormControl>
              <Input placeholder="+243 ..." {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
