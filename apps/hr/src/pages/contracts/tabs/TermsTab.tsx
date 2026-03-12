import { UseFormReturn } from "react-hook-form";
import {
  Input,
  Textarea,
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

const CURRENCIES = ["CDF", "USD", "EUR"];

export function TermsTab({ form }: { form: UseFormReturn<ContractFormValues> }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de début</FormLabel>
            <FormControl>
              <Input type="date" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de fin</FormLabel>
            <FormControl>
              <Input type="date" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="salary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salaire</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0" {...field} value={field.value ?? ""} />
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
              <Textarea rows={3} placeholder="Notes optionnelles" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
