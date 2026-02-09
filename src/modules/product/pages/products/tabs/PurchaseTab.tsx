import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RelationalField } from "@/core/crud/RelationalField";
import type { ProductFormValues } from "../product.schema";

export function PurchaseTab({ form }: { form: UseFormReturn<ProductFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "suppliers",
  });

  return (
    <div className="space-y-4">
      {/* Supplier pricelist table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Liste des fournisseurs et tarifs d&#39;achat
          </p>
          <Button
            type="button" size="sm" variant="outline"
            onClick={() => append({ supplier: "", supplierPrice: "", minQty: 1, deliveryLeadTime: "", currency: "CDF" })}
          >
            <Plus size={14} className="mr-1" /> Ajouter fournisseur
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg bg-muted/20">
            Aucun fournisseur. Cliquez sur &quot;Ajouter fournisseur&quot; pour commencer.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b text-left">
                  <th className="px-3 py-2 font-medium">Fournisseur</th>
                  <th className="px-3 py-2 font-medium w-28">Prix</th>
                  <th className="px-3 py-2 font-medium w-20">Devise</th>
                  <th className="px-3 py-2 font-medium w-24">Qté min.</th>
                  <th className="px-3 py-2 font-medium w-28">Délai (jours)</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} className="border-b last:border-0 align-top">
                    <td className="px-2 py-2">
                      <RelationalField
                        form={form}
                        name={`suppliers.${index}.supplier`}
                        label=""
                        service="stock"
                        endpoint="/supplier"
                        displayField="name"
                        placeholder="Chercher fournisseur..."
                      />
                    </td>
                    <td className="px-2 py-2">
                      <FormField control={form.control} name={`suppliers.${index}.supplierPrice`} render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="0" min={0} className="h-9" {...f} value={f.value ?? ""}
                              onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                          </FormControl>
                        </FormItem>
                      )} />
                    </td>
                    <td className="px-2 py-2">
                      <FormField control={form.control} name={`suppliers.${index}.currency`} render={({ field: f }) => (
                        <FormItem>
                          <Select value={f.value || "CDF"} onValueChange={f.onChange}>
                            <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="CDF">CDF</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </td>
                    <td className="px-2 py-2">
                      <FormField control={form.control} name={`suppliers.${index}.minQty`} render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="1" min={0} className="h-9" {...f} value={f.value ?? ""}
                              onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                          </FormControl>
                        </FormItem>
                      )} />
                    </td>
                    <td className="px-2 py-2">
                      <FormField control={form.control} name={`suppliers.${index}.deliveryLeadTime`} render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="0" min={0} className="h-9" {...f} value={f.value ?? ""}
                              onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                          </FormControl>
                        </FormItem>
                      )} />
                    </td>
                    <td className="px-2 py-2">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(index)}>
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Purchase description */}
      <FormField control={form.control} name="purchaseDescription" render={({ field }) => (
        <FormItem>
          <FormLabel>Description pour les commandes d&#39;achat</FormLabel>
          <FormControl><Textarea placeholder="Description visible sur les bons de commande fournisseur..." rows={3} {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />
    </div>
  );
}
