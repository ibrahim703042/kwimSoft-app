import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { RelationalField } from "@/core/crud/RelationalField";
import type { MOFormValues } from "../mo.schema";

const UOM_OPTIONS = [
  { value: "Unit(s)", label: "Unit(s)" },
  { value: "Kg", label: "Kg" },
  { value: "L", label: "L" },
  { value: "m", label: "m" },
  { value: "Pcs", label: "Pcs" },
];

export function ComponentsTab({ form }: { form: UseFormReturn<MOFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "components",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Composants</h4>
        <Button
          type="button" size="sm" variant="link"
          className="text-primary h-auto py-0"
          onClick={() => append({ product: "", description: "", quantity: 1, uom: "Unit(s)", consumed: "" })}
        >
          <Plus size={14} className="mr-1" /> Ajouter une ligne
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg bg-muted/20">
          Aucun composant. Cliquez sur « Ajouter une ligne » pour commencer.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b text-left">
                <th className="w-8" />
                <th className="px-3 py-2 font-medium">Produit</th>
                <th className="px-3 py-2 font-medium">Description</th>
                <th className="px-3 py-2 font-medium w-24 text-right">Quantité</th>
                <th className="px-3 py-2 font-medium w-20">UdM</th>
                <th className="px-3 py-2 font-medium w-24 text-right">Consommé</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b last:border-0 align-middle hover:bg-muted/30 transition-colors">
                  <td className="px-1 text-center">
                    <GripVertical size={14} className="text-muted-foreground/50 cursor-grab" />
                  </td>
                  <td className="px-2 py-2">
                    <RelationalField
                      form={form}
                      name={`components.${index}.product`}
                      label=""
                      service="product"
                      endpoint="/product"
                      displayField="name"
                      secondaryField="internalRef"
                      placeholder="Chercher produit..."
                    />
                  </td>
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`components.${index}.description`} render={({ field: f }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Description" className="h-9" {...f} value={f.value ?? ""} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </td>
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`components.${index}.quantity`} render={({ field: f }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="1" min={0} step="0.001" className="h-9 text-right" {...f} value={f.value ?? ""}
                            onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </td>
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`components.${index}.uom`} render={({ field: f }) => (
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
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`components.${index}.consumed`} render={({ field: f }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="0" min={0} className="h-9 text-right" {...f} value={f.value ?? ""}
                            onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </td>
                  <td className="px-2 py-2">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(index)}>
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
  );
}
