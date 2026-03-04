import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RelationalField } from "@/core/crud";
import type { POFormValues } from "./po.schema";

const supplierCreateFields = [
  { name: "name", label: "Nom du fournisseur", type: "text" as const, required: true },
  { name: "email", label: "Email", type: "text" as const, placeholder: "email@example.com" },
  { name: "phone", label: "Téléphone", type: "text" as const, placeholder: "+243..." },
  { name: "address", label: "Adresse", type: "textarea" as const },
];

const supplierCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const statusSteps = [
  { key: "draft", label: "BROUILLON" },
  { key: "submitted", label: "SOUMIS" },
  { key: "dept_head", label: "CHEF DEPT" },
  { key: "budget", label: "BUDGET" },
  { key: "purchasing", label: "ACHAT" },
  { key: "done", label: "TERMINÉ" },
];

export function POFormHeader({ form }: { form: UseFormReturn<POFormValues> }) {
  const currentStatus = form.watch("status") || "draft";

  const currentIndex = statusSteps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="space-y-4">
      {/* Status workflow bar */}
      <div className="flex items-center gap-1 flex-wrap">
        {statusSteps.map((step, i) => (
          <Badge
            key={step.key}
            variant={i <= currentIndex ? "default" : "outline"}
            className={`cursor-pointer text-[10px] px-2 py-0.5 ${
              i <= currentIndex
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => form.setValue("status", step.key)}
          >
            {step.label}
          </Badge>
        ))}
      </div>

      {/* Order number */}
      <FormField
        control={form.control}
        name="orderNumber"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="PO-00001"
                className="text-xl font-bold h-12 border-0 border-b rounded-none focus-visible:ring-0 px-0 w-60"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Two-column header fields */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        {/* Left column */}
        <div className="space-y-3">
          <RelationalField
            form={form}
            name="supplier"
            label="Fournisseur"
            service="stock"
            endpoint="/supplier"
            displayField="name"
            secondaryField="email"
            placeholder="Sélectionner fournisseur..."
            createFields={supplierCreateFields}
            createSchema={supplierCreateSchema}
          />
          <FormField control={form.control} name="responsible" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Responsable</FormLabel>
              <FormControl><Input placeholder="Nom du responsable" className="h-9" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="requisitionDept" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Département demandeur</FormLabel>
              <FormControl><Input placeholder="Sales, IT, Admin..." className="h-9" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="chargingDept" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Département imputation</FormLabel>
              <FormControl><Input placeholder="Administration..." className="h-9" {...field} /></FormControl>
            </FormItem>
          )} />
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <FormField control={form.control} name="orderDate" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Date</FormLabel>
              <FormControl><Input type="date" className="h-9" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="expectedDate" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Date souhaitée</FormLabel>
              <FormControl><Input type="date" className="h-9" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="purpose" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Objet</FormLabel>
              <FormControl><Input placeholder="Office Supplies, Equipment..." className="h-9" {...field} /></FormControl>
            </FormItem>
          )} />
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            <FormField control={form.control} name="mtoEnabled" render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox id="mtoEnabled" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="mtoEnabled" className="text-sm cursor-pointer">MTO (Réappro. sur commande)</Label>
              </div>
            )} />
            <FormField control={form.control} name="autoCreatePO" render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox id="autoCreatePO" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="autoCreatePO" className="text-sm cursor-pointer">Auto-achat depuis POS</Label>
              </div>
            )} />
          </div>
        </div>
      </div>
    </div>
  );
}
