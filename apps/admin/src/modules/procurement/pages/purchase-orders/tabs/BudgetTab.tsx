import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import type { POFormValues } from "../po.schema";

export function BudgetTab({ form }: { form: UseFormReturn<POFormValues> }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="budgetCode" render={({ field }) => (
          <FormItem>
            <FormLabel>Code budget</FormLabel>
            <FormControl><Input placeholder="BUD-2026-001" {...field} value={field.value ?? ""} /></FormControl>
          </FormItem>
        )} />
        <FormField control={form.control} name="budgetAmount" render={({ field }) => (
          <FormItem>
            <FormLabel>Montant budgétisé</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0.00" min={0} step="0.01" {...field} value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
            </FormControl>
          </FormItem>
        )} />
      </div>

      <FormField control={form.control} name="budgetNotes" render={({ field }) => (
        <FormItem>
          <FormLabel>Notes budget</FormLabel>
          <FormControl><Textarea placeholder="Justification du budget..." rows={3} {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />

      <div className="border-t pt-4" />

      <FormField control={form.control} name="purchaseInstructions" render={({ field }) => (
        <FormItem>
          <FormLabel>Instructions d'achat</FormLabel>
          <FormControl><Textarea placeholder="Deliver the goods to Admin Office..." rows={3} {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />

      <FormField control={form.control} name="notes" render={({ field }) => (
        <FormItem>
          <FormLabel>Notes supplémentaires</FormLabel>
          <FormControl><Textarea placeholder="Remarques internes..." rows={3} {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />
    </div>
  );
}
