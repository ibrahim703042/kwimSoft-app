/**
 * ProductListPage — Full Odoo-style product form
 *
 * Header: [Name]  [Image]
 *         ☑ Peut être vendu  ☑ Peut être acheté
 * ──────────────────────────────────────────────
 * Général │ Attributs* │ Ventes* │ Achats* │ Stock* │ Notes
 *   (* conditional based on booleans / product type)
 *
 * - Type, Ref, Barcode live in General tab
 * - Attributes table has image per row (like Odoo)
 * - Achats tab has inline supplier pricelist table (like Odoo)
 * - No separate Images tab (main image in header, variant images in attributes)
 */
import { z } from "zod";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus, Trash2, Box, SlidersHorizontal, FileText,
  ShoppingCart, Truck, Warehouse, ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { CrudPage } from "@/core/crud/CrudPage";
import { CrudForm } from "@/core/crud/CrudForm";
import { TabbedForm, FormTab } from "@/core/crud/TabbedForm";
import { RelationalField } from "@/core/crud/RelationalField";
import { createEntityApi } from "@/core/crud/createModule";
import Swal from "sweetalert2";

// ─── API ──────────────────────────────────────────────────────
const productApi = createEntityApi("product", "/product");

// ─── Schema ───────────────────────────────────────────────────
const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  // Odoo booleans → control which tabs appear
  canBeSold: z.boolean().default(true),
  canBePurchased: z.boolean().default(true),
  trackInventory: z.boolean().default(true),
  // General tab fields
  productType: z.string().default("goods"),
  internalRef: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  status: z.string().default("draft"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  // Sales tab
  price: z.number().min(0).optional().or(z.literal("")),
  currency: z.string().default("CDF"),
  salesTax: z.string().optional(),
  invoicingPolicy: z.string().optional(),
  // Purchase tab — supplier pricelist table
  suppliers: z.array(z.object({
    supplier: z.string(),
    supplierPrice: z.number().min(0).optional().or(z.literal("")),
    minQty: z.number().min(0).optional().or(z.literal("")),
    deliveryLeadTime: z.number().min(0).optional().or(z.literal("")),
    currency: z.string().default("CDF"),
  })).optional(),
  purchaseDescription: z.string().optional(),
  // Inventory tab
  stockQuantity: z.number().min(0).optional().or(z.literal("")),
  weight: z.number().min(0).optional().or(z.literal("")),
  volume: z.number().min(0).optional().or(z.literal("")),
  unit: z.string().default("pcs"),
  warehouse: z.string().optional(),
  reorderMin: z.number().min(0).optional().or(z.literal("")),
  reorderMax: z.number().min(0).optional().or(z.literal("")),
  trackingType: z.string().optional(),
  // Image (header)
  image: z.string().optional(),
  // Attributes — each row has attribute, value, and optional image
  attributes: z.array(z.object({
    attribute: z.string(),
    value: z.string(),
    image: z.string().optional(),
  })).optional(),
  tags: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const defaultValues: ProductFormValues = {
  name: "",
  canBeSold: true,
  canBePurchased: true,
  trackInventory: true,
  productType: "goods",
  internalRef: "",
  barcode: "",
  category: "",
  subCategory: "",
  brand: "",
  shortDescription: "",
  description: "",
  status: "draft",
  isActive: true,
  isFeatured: false,
  price: "",
  currency: "CDF",
  salesTax: "",
  invoicingPolicy: "ordered",
  suppliers: [],
  purchaseDescription: "",
  stockQuantity: "",
  weight: "",
  volume: "",
  unit: "pcs",
  warehouse: "",
  reorderMin: "",
  reorderMax: "",
  trackingType: "none",
  image: "",
  attributes: [],
  tags: [],
};

// ─── Table Columns ────────────────────────────────────────────
const columns: ColumnDef<any>[] = [
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }) =>
      row.original.image ? (
        <img src={row.original.image} alt={row.original.name} className="w-10 h-10 rounded object-cover" />
      ) : (
        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
          <Box size={16} className="text-muted-foreground" />
        </div>
      ),
  },
  { header: "Nom", accessorKey: "name" },
  { header: "Réf.", accessorKey: "internalRef" },
  {
    header: "Type",
    accessorKey: "productType",
    cell: ({ row }) => {
      const t = row.original.productType || row.original.type;
      const labels: Record<string, string> = { goods: "Biens", service: "Service", combo: "Combo" };
      return <span className="capitalize">{labels[t] || t || "—"}</span>;
    },
  },
  {
    header: "Prix",
    accessorKey: "price",
    cell: ({ row }) => {
      const p = row.original.price;
      return p != null && p !== "" ? `${p} ${row.original.currency || "CDF"}` : "—";
    },
  },
  {
    header: "Vente",
    accessorKey: "canBeSold",
    cell: ({ row }) => row.original.canBeSold ? "✓" : "—",
  },
  {
    header: "Achat",
    accessorKey: "canBePurchased",
    cell: ({ row }) => row.original.canBePurchased ? "✓" : "—",
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }) => {
      const s = row.original.status;
      const colors: Record<string, string> = { active: "text-green-600", draft: "text-gray-500", archived: "text-red-600" };
      const labels: Record<string, string> = { active: "Actif", draft: "Brouillon", archived: "Archivé" };
      return <span className={`font-medium ${colors[s] || ""}`}>{labels[s] || s || "—"}</span>;
    },
  },
];

// ═══════════════════════════════════════════════════════════════
//  ATTRIBUTE TABLE — Odoo style with image per row
// ═══════════════════════════════════════════════════════════════

function AttributeValuesTab({ form }: { form: UseFormReturn<ProductFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const handleRowImage = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue(`attributes.${index}.image`, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Attributs et variantes du produit (couleur, taille, matière...)
        </p>
        <Button type="button" size="sm" variant="outline" onClick={() => append({ attribute: "", value: "", image: "" })}>
          <Plus size={14} className="mr-1" /> Ajouter ligne
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg bg-muted/20">
          Aucun attribut. Cliquez sur &quot;Ajouter ligne&quot; pour commencer.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b text-left">
                <th className="px-3 py-2 font-medium w-12">Image</th>
                <th className="px-3 py-2 font-medium">Attribut</th>
                <th className="px-3 py-2 font-medium">Valeur(s)</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                const rowImage = form.watch(`attributes.${index}.image`);
                return (
                  <tr key={field.id} className="border-b last:border-0 align-top">
                    {/* Image cell */}
                    <td className="px-2 py-2">
                      {rowImage ? (
                        <div className="relative group w-10 h-10">
                          <img src={rowImage} alt="" className="w-10 h-10 rounded object-cover border" />
                          <button
                            type="button"
                            className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            onClick={() => form.setValue(`attributes.${index}.image`, "")}
                          >
                            <Trash2 size={10} className="text-white" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center w-10 h-10 border border-dashed rounded cursor-pointer hover:bg-muted/50 transition-colors">
                          <ImagePlus size={14} className="text-muted-foreground" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleRowImage(index, f);
                            }}
                          />
                        </label>
                      )}
                    </td>
                    {/* Attribute cell */}
                    <td className="px-2 py-2">
                      <RelationalField
                        form={form}
                        name={`attributes.${index}.attribute`}
                        label=""
                        service="product"
                        endpoint="/attribute"
                        displayField="name"
                        secondaryField="code"
                        placeholder="Chercher attribut..."
                        createFields={[
                          { name: "name", label: "Nom", type: "text", required: true },
                          { name: "code", label: "Code", type: "text", placeholder: "color, size..." },
                          {
                            name: "type", label: "Type", type: "select",
                            options: [
                              { value: "text", label: "Texte" },
                              { value: "number", label: "Nombre" },
                              { value: "color", label: "Couleur" },
                              { value: "size", label: "Taille" },
                            ],
                          },
                        ]}
                        createSchema={z.object({ name: z.string().min(1), code: z.string().optional(), type: z.string().optional() })}
                      />
                    </td>
                    {/* Value cell */}
                    <td className="px-2 py-2">
                      <FormField
                        control={form.control}
                        name={`attributes.${index}.value`}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...f} placeholder="Rouge, XL, Coton..." className="h-9" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    {/* Delete */}
                    <td className="px-2 py-2">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(index)}>
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUPPLIER PRICELIST TABLE — Odoo Achats tab style
// ═══════════════════════════════════════════════════════════════

function SupplierPricelistTab({ form }: { form: UseFormReturn<ProductFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "suppliers",
  });

  return (
    <div className="space-y-4">
      {/* Supplier table */}
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

      {/* Purchase description below table */}
      <FormField control={form.control} name="purchaseDescription" render={({ field }) => (
        <FormItem>
          <FormLabel>Description pour les commandes d&#39;achat</FormLabel>
          <FormControl><Textarea placeholder="Description visible sur les bons de commande fournisseur..." rows={3} {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  FORM HEADER — Only Name + Image + Booleans
// ═══════════════════════════════════════════════════════════════

function ProductFormHeader({ form }: { form: UseFormReturn<ProductFormValues> }) {
  const imageVal = form.watch("image");

  return (
    <div className="flex gap-4 items-start">
      {/* Left side: Name + Booleans */}
      <div className="flex-1 space-y-3">
        {/* Product name — large input like Odoo */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Nom du produit"
                  className="text-lg font-semibold h-12 border-0 border-b rounded-none focus-visible:ring-0 px-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boolean toggles */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <FormField control={form.control} name="canBeSold" render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox id="canBeSold" checked={field.value} onCheckedChange={field.onChange} />
              <Label htmlFor="canBeSold" className="text-sm font-medium cursor-pointer">Peut être vendu</Label>
            </div>
          )} />
          <FormField control={form.control} name="canBePurchased" render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox id="canBePurchased" checked={field.value} onCheckedChange={field.onChange} />
              <Label htmlFor="canBePurchased" className="text-sm font-medium cursor-pointer">Peut être acheté</Label>
            </div>
          )} />
        </div>
      </div>

      {/* Right side: Product image */}
      <div className="shrink-0">
        {imageVal ? (
          <div className="relative group">
            <img src={imageVal} alt="Produit" className="w-28 h-28 rounded-lg object-cover border" />
            <button
              type="button"
              className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
              onClick={() => form.setValue("image", "")}
            >
              Changer
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <Box size={24} className="text-muted-foreground mb-1" />
            <span className="text-[10px] text-muted-foreground">Image</span>
            <input
              type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => form.setValue("image", reader.result as string);
                reader.readAsDataURL(file);
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONDITIONAL TABS
// ═══════════════════════════════════════════════════════════════

function getProductTabs(form: UseFormReturn<ProductFormValues>): FormTab[] {
  const canBeSold = form.watch("canBeSold");
  const canBePurchased = form.watch("canBePurchased");
  const productType = form.watch("productType");
  const trackInventory = form.watch("trackInventory");
  const isGoods = productType === "goods" || productType === "combo";

  const tabs: FormTab[] = [];

  // ── 1. GENERAL (always) ───────────────────────────────────
  tabs.push({
    key: "general",
    label: "Informations générales",
    icon: <Box size={14} />,
    render: (f) => (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {/* Type, Ref, Barcode — moved here from header */}
        <FormField control={f.control} name="productType" render={({ field }) => (
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
        <FormField control={f.control} name="internalRef" render={({ field }) => (
          <FormItem>
            <FormLabel>Référence interne</FormLabel>
            <FormControl><Input placeholder="REF-001" {...field} value={field.value ?? ""} /></FormControl>
          </FormItem>
        )} />
        <FormField control={f.control} name="barcode" render={({ field }) => (
          <FormItem>
            <FormLabel>Code-barre</FormLabel>
            <FormControl><Input placeholder="EAN / UPC" {...field} value={field.value ?? ""} /></FormControl>
          </FormItem>
        )} />
        <RelationalField form={f} name="category" label="Catégorie" service="product" endpoint="/category" displayField="name" placeholder="Chercher catégorie..."
          createFields={[
            { name: "name", label: "Nom", type: "text", required: true },
            { name: "slug", label: "Slug", type: "text" },
            { name: "description", label: "Description", type: "textarea", colSpan: 2 },
          ]}
          createSchema={z.object({ name: z.string().min(1), slug: z.string().optional(), description: z.string().optional() })}
        />
        <RelationalField form={f} name="subCategory" label="Sous-catégorie" service="product" endpoint="/sub-category" displayField="name" placeholder="Chercher sous-catégorie..." />
        <RelationalField form={f} name="brand" label="Marque" service="product" endpoint="/brand" displayField="name" placeholder="Chercher marque..."
          createFields={[
            { name: "name", label: "Nom", type: "text", required: true },
            { name: "slug", label: "Slug", type: "text" },
            { name: "website", label: "Site web", type: "text" },
          ]}
          createSchema={z.object({ name: z.string().min(1), slug: z.string().optional(), website: z.string().optional() })}
        />
        <FormField control={f.control} name="status" render={({ field }) => (
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
        )} />
        <div className="sm:col-span-2 flex flex-wrap gap-6">
          <FormField control={f.control} name="isActive" render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              <Label className="text-sm">Actif</Label>
            </div>
          )} />
          <FormField control={f.control} name="isFeatured" render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              <Label className="text-sm">En vedette</Label>
            </div>
          )} />
        </div>
        <FormField control={f.control} name="shortDescription" render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Description courte</FormLabel>
            <FormControl><Textarea placeholder="Brève description..." rows={2} {...field} value={field.value ?? ""} /></FormControl>
          </FormItem>
        )} />
      </div>
    ),
  });

  // ── 2. ATTRIBUTES & VARIANTS (goods/combo only) ───────────
  if (isGoods) {
    tabs.push({
      key: "attributes",
      label: "Attributs & Variantes",
      icon: <SlidersHorizontal size={14} />,
      badge: form.watch("attributes")?.length || 0,
      render: (f) => <AttributeValuesTab form={f as UseFormReturn<ProductFormValues>} />,
    });
  }

  // ── 3. SALES (only if canBeSold) ──────────────────────────
  if (canBeSold) {
    tabs.push({
      key: "sales",
      label: "Ventes",
      icon: <ShoppingCart size={14} />,
      render: (f) => (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <FormField control={f.control} name="price" render={({ field }) => (
            <FormItem>
              <FormLabel>Prix de vente</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" min={0} {...field} value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={f.control} name="currency" render={({ field }) => (
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
          <FormField control={f.control} name="salesTax" render={({ field }) => (
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
          <FormField control={f.control} name="invoicingPolicy" render={({ field }) => (
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
      ),
    });
  }

  // ── 4. PURCHASE — supplier pricelist table (only if canBePurchased) ──
  if (canBePurchased) {
    tabs.push({
      key: "purchase",
      label: "Achats",
      icon: <Truck size={14} />,
      badge: form.watch("suppliers")?.length || 0,
      render: (f) => <SupplierPricelistTab form={f as UseFormReturn<ProductFormValues>} />,
    });
  }

  // ── 5. INVENTORY (goods only) ─────────────────────────────
  if (isGoods) {
    tabs.push({
      key: "inventory",
      label: "Inventaire",
      icon: <Warehouse size={14} />,
      render: (f) => (
        <div className="space-y-4">
          <FormField control={f.control} name="trackInventory" render={({ field }) => (
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
              <Checkbox id="trackInventory" checked={field.value} onCheckedChange={field.onChange} />
              <Label htmlFor="trackInventory" className="text-sm font-medium cursor-pointer">Suivre l&#39;inventaire</Label>
              <span className="text-xs text-muted-foreground ml-2">
                (Suivi des stocks, prévisions et règles de réapprovisionnement)
              </span>
            </div>
          )} />

          {trackInventory ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <FormField control={f.control} name="trackingType" render={({ field }) => (
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
              <FormField control={f.control} name="stockQuantity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité en stock</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" min={0} {...field} value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                </FormItem>
              )} />
              <RelationalField form={f} name="warehouse" label="Entrepôt" service="stock" endpoint="/warehouse" displayField="name" placeholder="Chercher entrepôt..." />
              <FormField control={f.control} name="unit" render={({ field }) => (
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
              <FormField control={f.control} name="weight" render={({ field }) => (
                <FormItem>
                  <FormLabel>Poids (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" min={0} step={0.01} {...field} value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={f.control} name="volume" render={({ field }) => (
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
                  <FormField control={f.control} name="reorderMin" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock minimum</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" min={0} {...field} value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={f.control} name="reorderMax" render={({ field }) => (
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
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">
              L&#39;inventaire n&#39;est pas suivi pour ce produit.
            </div>
          )}
        </div>
      ),
    });
  }

  // ── 6. NOTES (always) ─────────────────────────────────────
  tabs.push({
    key: "notes",
    label: "Notes",
    icon: <FileText size={14} />,
    render: (f) => (
      <FormField control={f.control} name="description" render={({ field }) => (
        <FormItem>
          <FormLabel>Notes internes / Description détaillée</FormLabel>
          <FormControl><Textarea placeholder="Description complète du produit..." rows={8} {...field} value={field.value ?? ""} /></FormControl>
        </FormItem>
      )} />
    ),
  });

  return tabs;
}

// ═══════════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function ProductListPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const qc = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        ...defaultValues,
        ...editing,
        attributes: editing.attributes || [],
        suppliers: editing.suppliers || [],
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editing]);

  const mutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (editing) {
        const id = editing._id || editing.id;
        return productApi.update(id, values);
      }
      return productApi.create(values);
    },
    onSuccess: () => {
      Swal.fire("Succès!", `Produit ${editing ? "modifié" : "créé"} avec succès.`, "success");
      qc.invalidateQueries({ queryKey: ["product"] });
      closeForm();
    },
    onError: (err: any) => {
      Swal.fire("Erreur!", err.response?.data?.message || "Une erreur est survenue.", "error");
    },
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.reset(defaultValues);
  };

  const tabs = getProductTabs(form);

  return (
    <>
      <CrudPage
        config={{
          title: "Produits",
          queryKey: ["product"],
          queryFn: productApi.list,
          columns,
          deleteFn: async (id: string) => { await productApi.delete(id); },
          permissions: {
            read: "product.read",
            create: "product.create",
            update: "product.update",
            delete: "product.delete",
          },
        }}
        addButton={
          <Button className="bg-[#0F123F]" size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Nouveau produit
          </Button>
        }
        onEdit={(row: any) => { setEditing(row); setFormOpen(true); }}
      />

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => { if (!open) closeForm(); else setFormOpen(true); }}
        title={editing ? "Modifier Produit" : "Nouveau Produit"}
        form={form}
        onSubmit={(data) => mutation.mutateAsync(data)}
        isLoading={mutation.isPending}
        submitText={editing ? "Enregistrer" : "Créer"}
        cancelText="Annuler"
        wide
      >
        {/* Odoo-style header: Name + Image + Booleans ONLY */}
        <ProductFormHeader form={form} />
        <div className="border-t my-2" />
        {/* Conditional tabs */}
        <TabbedForm form={form} tabs={tabs} />
      </CrudForm>
    </>
  );
}
