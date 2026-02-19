import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import type { MOFormValues } from "../mo.schema";

export function NotesTab({ form }: { form: UseFormReturn<MOFormValues> }) {
  return (
    <div className="space-y-4">
      <FormField control={form.control} name="sourceDocument" render={({ field }) => (
        <FormItem>
          <FormLabel>Document source</FormLabel>
          <FormControl><Input placeholder="SO-001, REQ-001..." {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />
      <FormField control={form.control} name="notes" render={({ field }) => (
        <FormItem>
          <FormLabel>Notes internes</FormLabel>
          <FormControl><Textarea placeholder="Notes supplémentaires..." rows={5} {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />
    </div>
  );
}
