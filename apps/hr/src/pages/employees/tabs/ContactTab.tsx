import { UseFormReturn } from "react-hook-form";
import { Input, FormField, FormItem, FormLabel, FormControl } from "@kwim/shared-ui";
import type { EmployeeFormValues } from "../employee.schema";

export function ContactTab({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="email@exemple.com" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone</FormLabel>
            <FormControl>
              <Input placeholder="+243 ..." {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input placeholder="Adresse complète" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
