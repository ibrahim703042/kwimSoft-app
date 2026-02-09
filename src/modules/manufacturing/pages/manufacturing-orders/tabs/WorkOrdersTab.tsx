import { z } from "zod";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { RelationalField } from "@/core/crud/RelationalField";
import type { MOFormValues } from "../mo.schema";

const WO_STATUS = [
  { value: "pending", label: "En attente", color: "bg-gray-100 text-gray-700" },
  { value: "ready", label: "Prêt", color: "bg-blue-100 text-blue-700" },
  { value: "in_progress", label: "En cours", color: "bg-orange-100 text-orange-700" },
  { value: "done", label: "Terminé", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Annulé", color: "bg-red-100 text-red-700" },
];

export function WorkOrdersTab({ form }: { form: UseFormReturn<MOFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workOrders",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Ordres de travail</h4>
        <Button
          type="button" size="sm" variant="link"
          className="text-primary h-auto py-0"
          onClick={() => append({ operation: "", workCenter: "", durationExpected: "", durationActual: "", status: "pending" })}
        >
          <Plus size={14} className="mr-1" /> Ajouter une ligne
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg bg-muted/20">
          Aucun ordre de travail. Cliquez sur « Ajouter une ligne ».
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b text-left">
                <th className="w-8" />
                <th className="px-3 py-2 font-medium">Opération</th>
                <th className="px-3 py-2 font-medium">Poste de travail</th>
                <th className="px-3 py-2 font-medium w-28 text-right">Durée prévue (min)</th>
                <th className="px-3 py-2 font-medium w-28 text-right">Durée réelle (min)</th>
                <th className="px-3 py-2 font-medium w-28">Statut</th>
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
                      name={`workOrders.${index}.operation`}
                      label=""
                      service="stock"
                      endpoint="/operation"
                      displayField="name"
                      placeholder="Chercher opération..."
                      createFields={[
                        { name: "name", label: "Nom", type: "text" as const, required: true },
                        { name: "sequence", label: "Séquence", type: "number" as const },
                      ]}
                      createSchema={z.object({ name: z.string().min(1), sequence: z.number().optional() })}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <RelationalField
                      form={form}
                      name={`workOrders.${index}.workCenter`}
                      label=""
                      service="stock"
                      endpoint="/work-center"
                      displayField="name"
                      secondaryField="code"
                      placeholder="Chercher poste..."
                    />
                  </td>
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`workOrders.${index}.durationExpected`} render={({ field: f }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="0" min={0} className="h-9 text-right" {...f} value={f.value ?? ""}
                            onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </td>
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`workOrders.${index}.durationActual`} render={({ field: f }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="0" min={0} className="h-9 text-right" {...f} value={f.value ?? ""}
                            onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </td>
                  <td className="px-2 py-2">
                    <FormField control={form.control} name={`workOrders.${index}.status`} render={({ field: f }) => (
                      <FormItem>
                        <Select value={f.value || "pending"} onValueChange={f.onChange}>
                          <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {WO_STATUS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
