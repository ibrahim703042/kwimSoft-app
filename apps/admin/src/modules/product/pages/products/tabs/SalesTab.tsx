import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function SalesTab({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField control={form.control} name="price" render={({ field }) => (
        <FormItem>
          <FormLabel>Prix de vente</FormLabel>
          <FormControl>
            <Input type="number" placeholder="0.00" min={0} {...field} value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="currency" render={({ field }) => (
        <FormItem>
          <FormLabel>Devise</FormLabel>
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="CDF">CDF</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )} />

      <FormField control={form.control} name="salesTax" render={({ field }) => (
        <FormItem>
          <FormLabel>Taxes à la vente</FormLabel>
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Aucune taxe" /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="none">Aucune taxe</SelectItem>
              <SelectItem value="tva_16">TVA 16%</SelectItem>
              <SelectItem value="tva_10">TVA 10%</SelectItem>
              <SelectItem value="tva_0">Exonéré</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )} />

      <FormField control={form.control} name="invoicingPolicy" render={({ field }) => (
        <FormItem>
          <FormLabel>Politique de facturation</FormLabel>
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="ordered">Quantités commandées</SelectItem>
              <SelectItem value="delivered">Quantités livrées</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )} />
    </div>
  );
}
