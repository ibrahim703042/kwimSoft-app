import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import type { AttendanceFormValues } from "../attendance.schema";

export function ScheduleTab({ form }: { form: UseFormReturn<AttendanceFormValues> }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="checkInTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heure d'arrivée</FormLabel>
            <FormControl>
              <Input type="time" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="checkOutTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heure de départ</FormLabel>
            <FormControl>
              <Input type="time" {...field} value={field.value ?? ""} />
            </FormControl>
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
              <Input placeholder="Notes optionnelles" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
