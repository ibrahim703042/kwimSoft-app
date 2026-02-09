import { z } from "zod";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { RelationalField } from "@/core/crud/RelationalField";
import type { ProductFormValues } from "../product.schema";

export function AttributesTab({ form }: { form: UseFormReturn<ProductFormValues> }) {
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
                            type="file" accept="image/*" className="hidden"
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
