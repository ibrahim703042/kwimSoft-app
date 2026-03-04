import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RelationalField } from "@/core/crud";
import type { MOFormValues } from "./mo.schema";

const statusSteps = [
  { key: "draft", label: "BROUILLON" },
  { key: "confirmed", label: "CONFIRMÉ" },
  { key: "planned", label: "PLANIFIÉ" },
  { key: "in_progress", label: "EN COURS" },
  { key: "done", label: "TERMINÉ" },
];

const UOM_OPTIONS = [
  { value: "Unit(s)", label: "Unit(s)" },
  { value: "Kg", label: "Kg" },
  { value: "L", label: "L" },
  { value: "m", label: "m" },
  { value: "Pcs", label: "Pcs" },
];

export function MOFormHeader({ form }: { form: UseFormReturn<MOFormValues> }) {
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

      {/* Reference number */}
      <FormField
        control={form.control}
        name="reference"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="MO-00001"
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
            name="product"
            label="Produit à fabriquer"
            service="product"
            endpoint="/product"
            displayField="name"
            secondaryField="internalRef"
            placeholder="Sélectionner produit..."
          />
          <RelationalField
            form={form}
            name="bom"
            label="Nomenclature (BOM)"
            service="stock"
            endpoint="/bom"
            displayField="name"
            secondaryField="reference"
            placeholder="Sélectionner nomenclature..."
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField control={form.control} name="quantity" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Quantité</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" min={0} step="0.01" className="h-9" {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                </FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="uom" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">UdM</FormLabel>
                <Select value={field.value || "Unit(s)"} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {UOM_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <FormField control={form.control} name="responsible" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Responsable</FormLabel>
              <FormControl><Input placeholder="Nom du responsable" className="h-9" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="scheduledDate" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Date planifiée</FormLabel>
              <FormControl><Input type="date" className="h-9" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="deadline" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Date limite</FormLabel>
              <FormControl><Input type="date" className="h-9" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="priority" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Priorité</FormLabel>
              <Select value={field.value || "normal"} onValueChange={field.onChange}>
                <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="normal">Normale</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} />
        </div>
      </div>
    </div>
  );
}
