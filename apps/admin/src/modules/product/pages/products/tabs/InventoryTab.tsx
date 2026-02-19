import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RelationalField } from "@/core/crud/RelationalField";

export function InventoryTab({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField control={form.control} name="trackingType" render={({ field }) => (
        <FormItem>
          <FormLabel>Suivi par</FormLabel>
          <Select value={field.value || "none"} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="none">Par quantité</SelectItem>
              <SelectItem value="lot">Par lots</SelectItem>
              <SelectItem value="serial">Par numéro de série unique</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )} />

      <FormField control={form.control} name="stockQuantity" render={({ field }) => (
        <FormItem>
          <FormLabel>Quantité en stock</FormLabel>
          <FormControl>
            <Input type="number" placeholder="0" min={0} {...field} value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
          </FormControl>
        </FormItem>
      )} />

      <RelationalField form={form} name="warehouse" label="Entrepôt" service="stock" endpoint="/warehouse" displayField="name" placeholder="Chercher entrepôt..." />

      <FormField control={form.control} name="unit" render={({ field }) => (
        <FormItem>
          <FormLabel>Unité de mesure</FormLabel>
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="pcs">Pièce(s)</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="l">L</SelectItem>
              <SelectItem value="ml">mL</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )} />

      <FormField control={form.control} name="weight" render={({ field }) => (
        <FormItem>
          <FormLabel>Poids (kg)</FormLabel>
          <FormControl>
            <Input type="number" placeholder="0.00" min={0} step={0.01} {...field} value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
          </FormControl>
        </FormItem>
      )} />

      <FormField control={form.control} name="volume" render={({ field }) => (
        <FormItem>
          <FormLabel>Volume (m³)</FormLabel>
          <FormControl>
            <Input type="number" placeholder="0.00" min={0} step={0.001} {...field} value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
          </FormControl>
        </FormItem>
      )} />

      <div className="sm:col-span-2 border-t pt-4">
        <p className="text-sm font-medium mb-3">Règles de réapprovisionnement</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="reorderMin" render={({ field }) => (
            <FormItem>
              <FormLabel>Stock minimum</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" min={0} {...field} value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
              </FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="reorderMax" render={({ field }) => (
            <FormItem>
              <FormLabel>Stock maximum</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" min={0} {...field} value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
              </FormControl>
            </FormItem>
          )} />
        </div>
      </div>
    </div>
  );
}
