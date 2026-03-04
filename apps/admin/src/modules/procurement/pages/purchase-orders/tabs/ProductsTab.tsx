import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { RelationalField } from "@/core/crud";
import type { POFormValues } from "../po.schema";

const UOM_OPTIONS = [
  { value: "Unit(s)", label: "Unit(s)" },
  { value: "Kg", label: "Kg" },
  { value: "L", label: "L" },
  { value: "m", label: "m" },
  { value: "Box", label: "Boîte" },
  { value: "Pack", label: "Pack" },
  { value: "Pcs", label: "Pcs" },
];

export function ProductsTab({ form }: { form: UseFormReturn<POFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Calculate line total
  const getLineTotal = (index: number) => {
    const qty = Number(form.watch(`items.${index}.requestedQty`)) || 0;
    const price = Number(form.watch(`items.${index}.unitPrice`)) || 0;
    return (qty * price).toLocaleString();
  };

  // Calculate grand total
  const grandTotal = fields.reduce((sum, _, i) => {
    const qty = Number(form.watch(`items.${i}.requestedQty`)) || 0;
    const price = Number(form.watch(`items.${i}.unitPrice`)) || 0;
    return sum + qty * price;
  }, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Lignes de produits</h4>
        <Button
          type="button" size="sm" variant="link"
          className="text-primary h-auto py-0"
          onClick={() => append({ product: "", description: "", qtyAvailable: "", requestedQty: 1, uom: "Unit(s)", unitPrice: "" })}
        >
          <Plus size={14} className="mr-1" /> Ajouter une ligne
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg bg-muted/20">
          Aucune ligne. Cliquez sur « Ajouter une ligne » pour commencer.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b text-left">
                <th className="w-8" />
                <th className="px-3 py-2 font-medium">Produit</th>
                <th className="px-3 py-2 font-medium">Description</th>
                <th className="px-3 py-2 font-medium w-24 text-right">Qté dispo.</th>
                <th className="px-3 py-2 font-medium w-24 text-right">Qté demandée</th>
                <th className="px-3 py-2 font-medium w-20">UdM</th>
                <th className="px-3 py-2 font-medium w-28 text-right">Prix unit.</th>
                <th className="px-3 py-2 font-medium w-28 text-right">Total</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b last:border-0 align-middle hover:bg-muted/30 transition-colors">
                  <td className="px-1 text-center">
                    <GripVertical size={14} className="text-muted-foreground/50 cursor-grab" />
                  </td>
                  {/* Product */}
                  <td className="px-2 py-2">
                    <RelationalField
                      form={form}
                      name={`items.${index}.product`}
                      label=""
                      service="product"
                      endpoint="/product"
                      displayField="name"
                      secondaryField="internalRef"
                      placeholder="Chercher produit..."
                    />
                  </td>
                  {/* Description */}
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`items.${index}.description`} render={({ field: f }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Description" className="h-9" {...f} value={f.value ?? ""} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </td>
                  {/* Qty Available */}
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`items.${index}.qtyAvailable`} render={({ field: f }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="0" min={0} className="h-9 text-right" {...f} value={f.value ?? ""}
                            onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </td>
                  {/* Requested Qty */}
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`items.${index}.requestedQty`} render={({ field: f }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="1" min={0} step="0.001" className="h-9 text-right" {...f} value={f.value ?? ""}
                            onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </td>
                  {/* UOM */}
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`items.${index}.uom`} render={({ field: f }) => (
                      <FormItem>
                        <Select value={f.value || "Unit(s)"} onValueChange={f.onChange}>
                          <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {UOM_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </td>
                  {/* Unit Price */}
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field: f }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="0.00" min={0} step="0.01" className="h-9 text-right" {...f} value={f.value ?? ""}
                            onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </td>
                  {/* Line Total (read-only) */}
                  <td className="px-2 py-2 text-right font-medium">
                    {getLineTotal(index)}
                  </td>
                  {/* Delete */}
                  <td className="px-2 py-2">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(index)}>
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Grand Total footer */}
            <tfoot>
              <tr className="bg-muted/30 border-t">
                <td colSpan={7} className="px-3 py-2 text-right font-semibold text-sm">
                  Total
                </td>
                <td className="px-3 py-2 text-right font-bold text-sm">
                  {grandTotal.toLocaleString()}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
