import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import type { EmployeeFormValues } from "../employee.schema";

export function ContactTab({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
  return (
    <div className="space-y-6">
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

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Contact d'urgence</h4>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="emergencyContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du contact</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du contact d'urgence" {...field} value={field.value ?? ""} />
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
      </div>
    </div>
  );
}
