import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RelationalField } from "@/core/crud/RelationalField";

export function GeneralTab({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField control={form.control} name="productType" render={({ field }) => (
        <FormItem>
          <FormLabel>Type de produit</FormLabel>
          <Select value={field.value || "goods"} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="goods">Biens</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="combo">Combo</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )} />

      <FormField control={form.control} name="internalRef" render={({ field }) => (
        <FormItem>
          <FormLabel>Référence interne</FormLabel>
          <FormControl><Input placeholder="REF-001" {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />

      <FormField control={form.control} name="barcode" render={({ field }) => (
        <FormItem>
          <FormLabel>Code-barre</FormLabel>
          <FormControl><Input placeholder="EAN / UPC" {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />

      <RelationalField
        form={form} name="category" label="Catégorie"
        service="product" endpoint="/category" displayField="name"
        placeholder="Chercher catégorie..."
        createFields={[
          { name: "name", label: "Nom", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text" },
          { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        ]}
        createSchema={z.object({ name: z.string().min(1), slug: z.string().optional(), description: z.string().optional() })}
      />

      <RelationalField
        form={form} name="subCategory" label="Sous-catégorie"
        service="product" endpoint="/sub-category" displayField="name"
        placeholder="Chercher sous-catégorie..."
      />

      <RelationalField
        form={form} name="brand" label="Marque"
        service="product" endpoint="/brand" displayField="name"
        placeholder="Chercher marque..."
        createFields={[
          { name: "name", label: "Nom", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text" },
          { name: "website", label: "Site web", type: "text" },
        ]}
        createSchema={z.object({ name: z.string().min(1), slug: z.string().optional(), website: z.string().optional() })}
      />

      {/* <FormField control={form.control} name="status" render={({ field }) => (
        <FormItem>
          <FormLabel>Statut</FormLabel>
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )} /> */}

      {/* <div className="sm:col-span-2 flex flex-wrap gap-6">
        <FormField control={form.control} name="isActive" render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            <Label className="text-sm">Actif</Label>
          </div>
        )} />
        <FormField control={form.control} name="isFeatured" render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            <Label className="text-sm">En vedette</Label>
          </div>
        )} />
      </div> */}

      <FormField control={form.control} name="shortDescription" render={({ field }) => (
        <FormItem className="sm:col-span-2">
          <FormLabel>Description courte</FormLabel>
          <FormControl><Textarea placeholder="Brève description..." rows={2} {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />
    </div>
  );
}
