import { z } from "zod";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RelationalField } from "@/core/crud";
import type { ProductFormValues } from "../product.schema";

const supplierCreateFields = [
  { name: "name", label: "Nom du fournisseur", type: "text" as const, required: true },
  { name: "email", label: "Email", type: "text" as const, placeholder: "email@example.com" },
  { name: "phone", label: "Téléphone", type: "text" as const, placeholder: "+243..." },
  { name: "address", label: "Adresse", type: "textarea" as const },
  {
    name: "paymentTerms", label: "Conditions de paiement", type: "select" as const,
    options: [
      { value: "immediate", label: "Paiement immédiat" },
      { value: "net15", label: "Net 15 jours" },
      { value: "net30", label: "Net 30 jours" },
      { value: "net60", label: "Net 60 jours" },
    ],
  },
];

const supplierCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  paymentTerms: z.string().optional(),
});

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
          <h4 className="text-sm font-semibold">Fournisseurs</h4>
          <Button
            type="button" size="sm" variant="link"
            className="text-primary h-auto py-0"
            onClick={() => append({ supplier: "", supplierPrice: "", minQty: 1, deliveryLeadTime: "", currency: "CDF" })}
          >
            <Plus size={14} className="mr-1" /> Ajouter une ligne
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg bg-muted/20">
            Aucun fournisseur. Cliquez sur « Ajouter une ligne » pour commencer.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b text-left">
                  <th className="w-8" />
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
                  <tr key={field.id} className="border-b last:border-0 align-middle hover:bg-muted/30 transition-colors">
                    <td className="px-1 text-center">
                      <GripVertical size={14} className="text-muted-foreground/50 cursor-grab" />
                    </td>
                    <td className="px-2 py-2">
                      <RelationalField
                        form={form}
                        name={`suppliers.${index}.supplier`}
                        label=""
                        service="stock"
                        endpoint="/supplier"
                        displayField="name"
                        secondaryField="email"
                        placeholder="Chercher fournisseur..."
                        createFields={supplierCreateFields}
                        createSchema={supplierCreateSchema}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <FormField control={form.control} name={`suppliers.${index}.supplierPrice`} render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="0.00" min={0} step="0.01" className="h-9 text-right" {...f} value={f.value ?? ""}
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
                            <Input type="number" placeholder="1" min={0} className="h-9 text-right" {...f} value={f.value ?? ""}
                              onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                          </FormControl>
                        </FormItem>
                      )} />
                    </td>
                    <td className="px-2 py-2">
                      <FormField control={form.control} name={`suppliers.${index}.deliveryLeadTime`} render={({ field: f }) => (
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

      {/* Purchase description */}
      <FormField control={form.control} name="purchaseDescription" render={({ field }) => (
        <FormItem>
          <FormLabel>Description pour les commandes d'achat</FormLabel>
          <FormControl><Textarea placeholder="Description visible sur les bons de commande fournisseur..." rows={3} {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />
    </div>
  );
}
