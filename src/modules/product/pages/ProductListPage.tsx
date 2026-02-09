/**
 * ProductListPage — Odoo-style product form with:
 *  - Multi-tab layout (General, Attributes, Images, Notes)
 *  - Image upload
 *  - RelationalField for Category, SubCategory, Brand
 *  - Attribute values table (like Amazon product attributes)
 */
import { z } from "zod";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2, Box, SlidersHorizontal, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CrudPage } from "@/core/crud/CrudPage";
import { CrudForm } from "@/core/crud/CrudForm";
import { TabbedForm, FormTab } from "@/core/crud/TabbedForm";
import { RelationalField } from "@/core/crud/RelationalField";
import { ImageUploadField } from "@/core/crud/ImageUploadField";
import { createEntityApi } from "@/core/crud/createModule";
import Swal from "sweetalert2";

// ─── API ──────────────────────────────────────────────────────
const productApi = createEntityApi("product", "/product");

// ─── Schema ───────────────────────────────────────────────────
const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  sku: z.string().min(1, "Le SKU est requis"),
  type: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().min(0).optional().or(z.literal("")),
  costPrice: z.number().min(0).optional().or(z.literal("")),
  currency: z.string().optional(),
  stockQuantity: z.number().min(0).optional().or(z.literal("")),
  weight: z.number().min(0).optional().or(z.literal("")),
  unit: z.string().optional(),
  barcode: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  status: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  attributes: z
    .array(
      z.object({
        attribute: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const defaultValues: ProductFormValues = {
  name: "",
  sku: "",
  type: "",
  category: "",
  subCategory: "",
  brand: "",
  price: "",
  costPrice: "",
  currency: "CDF",
  stockQuantity: "",
  weight: "",
  unit: "kg",
  barcode: "",
  description: "",
  shortDescription: "",
  status: "draft",
  isActive: true,
  isFeatured: false,
  image: "",
  images: [],
  attributes: [],
  tags: [],
};

// ─── Columns ──────────────────────────────────────────────────
const columns: ColumnDef<any>[] = [
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }) =>
      row.original.image ? (
        <img
          src={row.original.image}
          alt={row.original.name}
          className="w-10 h-10 rounded object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
          <Box size={16} className="text-muted-foreground" />
        </div>
      ),
  },
  { header: "Nom", accessorKey: "name" },
  { header: "SKU", accessorKey: "sku" },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => {
      const t = row.original.type;
      const colors: Record<string, string> = {
        physical: "text-blue-600",
        digital: "text-purple-600",
        service: "text-amber-600",
      };
      return (
        <span className={`font-medium ${colors[t] || ""}`}>
          {(t || "—").toUpperCase()}
        </span>
      );
    },
  },
  {
    header: "Prix",
    accessorKey: "price",
    cell: ({ row }) =>
      `${row.original.price ?? 0} ${row.original.currency || "CDF"}`,
  },
  { header: "Stock", accessorKey: "stockQuantity" },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        active: "text-green-600",
        draft: "text-gray-500",
        archived: "text-red-600",
      };
      return (
        <span className={`font-medium ${colors[s] || ""}`}>
          {(s || "—").toUpperCase()}
        </span>
      );
    },
  },
];

// ─── Attribute Values Table (inline) ─────────────────────────
function AttributeValuesTab({ form }: { form: UseFormReturn<ProductFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Définissez les attributs du produit (couleur, taille, matière, etc.)
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => append({ attribute: "", value: "" })}
        >
          <Plus size={14} className="mr-1" />
          Ajouter
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg">
          Aucun attribut. Cliquez sur "Ajouter" pour définir un attribut.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left px-3 py-2 font-medium">Attribut</th>
                <th className="text-left px-3 py-2 font-medium">Valeur</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b last:border-0">
                  <td className="px-2 py-1">
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
                        {
                          name: "name",
                          label: "Nom",
                          type: "text",
                          required: true,
                        },
                        {
                          name: "code",
                          label: "Code",
                          type: "text",
                          placeholder: "color, size...",
                        },
                        {
                          name: "type",
                          label: "Type",
                          type: "select",
                          options: [
                            { value: "text", label: "Texte" },
                            { value: "number", label: "Nombre" },
                            { value: "color", label: "Couleur" },
                            { value: "size", label: "Taille" },
                          ],
                        },
                      ]}
                      createSchema={z.object({
                        name: z.string().min(1),
                        code: z.string().optional(),
                        type: z.string().optional(),
                      })}
                    />
                  </td>
                  <td className="px-2 py-1">
                    <FormField
                      control={form.control}
                      name={`attributes.${index}.value`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...f}
                              placeholder="Valeur (ex: Rouge, XL, Coton)"
                              className="h-9"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => remove(index)}
                    >
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

// ─── Product Form Tabs ───────────────────────────────────────
function getProductTabs(form: UseFormReturn<ProductFormValues>): FormTab[] {
  return [
    {
      key: "general",
      label: "Général",
      icon: <Box size={14} />,
      render: (f) => (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {/* Name */}
          <FormField
            control={f.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nom <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nom du produit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* SKU */}
          <FormField
            control={f.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  SKU <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="PRD-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Type */}
          <FormField
            control={f.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="physical">Physique</SelectItem>
                    <SelectItem value="digital">Numérique</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Barcode */}
          <FormField
            control={f.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code-barre</FormLabel>
                <FormControl>
                  <Input placeholder="123456789" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Category */}
          <RelationalField
            form={f}
            name="category"
            label="Catégorie"
            service="product"
            endpoint="/category"
            displayField="name"
            placeholder="Chercher catégorie..."
            createFields={[
              { name: "name", label: "Nom", type: "text", required: true },
              { name: "slug", label: "Slug", type: "text" },
              {
                name: "description",
                label: "Description",
                type: "textarea",
                colSpan: 2,
              },
            ]}
            createSchema={z.object({
              name: z.string().min(1),
              slug: z.string().optional(),
              description: z.string().optional(),
            })}
          />
          {/* SubCategory */}
          <RelationalField
            form={f}
            name="subCategory"
            label="Sous-catégorie"
            service="product"
            endpoint="/sub-category"
            displayField="name"
            placeholder="Chercher sous-catégorie..."
          />
          {/* Brand */}
          <RelationalField
            form={f}
            name="brand"
            label="Marque"
            service="product"
            endpoint="/brand"
            displayField="name"
            placeholder="Chercher marque..."
            createFields={[
              { name: "name", label: "Nom", type: "text", required: true },
              { name: "slug", label: "Slug", type: "text" },
              { name: "website", label: "Site web", type: "text" },
            ]}
            createSchema={z.object({
              name: z.string().min(1),
              slug: z.string().optional(),
              website: z.string().optional(),
            })}
          />
          {/* Status */}
          <FormField
            control={f.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Price */}
          <FormField
            control={f.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix de vente</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Cost price */}
          <FormField
            control={f.control}
            name="costPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix de revient</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Currency */}
          <FormField
            control={f.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Devise</FormLabel>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Devise" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CDF">CDF</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Stock */}
          <FormField
            control={f.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité en stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Weight */}
          <FormField
            control={f.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poids</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    step={0.01}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Unit */}
          <FormField
            control={f.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unité</FormLabel>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Unité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="ml">mL</SelectItem>
                    <SelectItem value="pcs">Pièce</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Checkboxes */}
          <div className="sm:col-span-2 flex gap-6">
            <FormField
              control={f.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Actif</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={f.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">En vedette</FormLabel>
                </FormItem>
              )}
            />
          </div>
          {/* Short description */}
          <FormField
            control={f.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Description courte</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brève description du produit"
                    rows={2}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
    },
    {
      key: "attributes",
      label: "Attributs",
      icon: <SlidersHorizontal size={14} />,
      badge: form.watch("attributes")?.length || 0,
      render: (f) => <AttributeValuesTab form={f as UseFormReturn<ProductFormValues>} />,
    },
    {
      key: "images",
      label: "Images",
      icon: <ImageIcon size={14} />,
      render: (f) => (
        <div className="space-y-4">
          <ImageUploadField
            form={f}
            name="image"
            label="Image principale"
            className="sm:col-span-1"
          />
          <ImageUploadField
            form={f}
            name="images"
            label="Galerie d'images"
            multiple
          />
        </div>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      icon: <FileText size={14} />,
      render: (f) => (
        <FormField
          control={f.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description détaillée</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description complète du produit..."
                  rows={8}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
  ];
}

// ─── Page Component ──────────────────────────────────────────
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
        images: editing.images || [],
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
      Swal.fire(
        "Succès!",
        `Produit ${editing ? "modifié" : "créé"} avec succès.`,
        "success"
      );
      qc.invalidateQueries({ queryKey: ["product"] });
      closeForm();
    },
    onError: (err: any) => {
      Swal.fire(
        "Erreur!",
        err.response?.data?.message || "Une erreur est survenue.",
        "error"
      );
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
          deleteFn: async (id: string) => {
            await productApi.delete(id);
          },
          permissions: {
            read: "product.read",
            create: "product.create",
            update: "product.update",
            delete: "product.delete",
          },
        }}
        addButton={
          <Button
            className="bg-[#0F123F]"
            size="sm"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        }
        onEdit={(row: any) => {
          setEditing(row);
          setFormOpen(true);
        }}
      />

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm();
          else setFormOpen(true);
        }}
        title={editing ? "Modifier Produit" : "Nouveau Produit"}
        description={
          editing
            ? "Modifier les informations de ce produit."
            : "Remplissez les informations pour créer un nouveau produit."
        }
        form={form}
        onSubmit={(data) => mutation.mutateAsync(data)}
        isLoading={mutation.isPending}
        submitText={editing ? "Modifier" : "Créer"}
        cancelText="Annuler"
        wide
      >
        <TabbedForm form={form} tabs={tabs} />
      </CrudForm>
    </>
  );
}
