import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import type { PayrollFormValues } from "../payroll.schema";

const CURRENCIES = ["CDF", "USD", "EUR"];

export function SalaryTab({ form }: { form: UseFormReturn<PayrollFormValues> }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="grossSalary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salaire brut</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="deductions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Déductions</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bonuses"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bonus</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="netSalary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salaire net</FormLabel>
            <FormControl>
              <Input type="number" readOnly className="bg-muted" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Devise</FormLabel>
            <Select value={field.value || "CDF"} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea rows={2} placeholder="Notes optionnelles" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
