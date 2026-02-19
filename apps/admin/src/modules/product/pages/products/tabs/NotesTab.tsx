import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

export function NotesTab({ form }: { form: UseFormReturn<any> }) {
  return (
    <FormField control={form.control} name="description" render={({ field }) => (
      <FormItem>
        <FormLabel>Notes internes / Description détaillée</FormLabel>
        <FormControl>
          <Textarea placeholder="Description complète du produit..." rows={8} {...field} value={field.value ?? ""} />
        </FormControl>
      </FormItem>
    )} />
  );
}
