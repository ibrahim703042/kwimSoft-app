/**
 * DynamicFormFields — Config-driven form field renderer
 *
 * Renders shadcn Form fields from a simple config array.
 * Eliminates boilerplate: instead of writing 20 FormField blocks,
 * you pass a config array and this component renders them all.
 *
 * Supports: text, number, email, password, date, time, textarea,
 *           select, checkbox, and custom render functions.
 */
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Field Config Types ──────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  /** Field name (maps to form field name) */
  name: string;
  /** Display label */
  label: string;
  /** Field type */
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "date"
    | "time"
    | "datetime-local"
    | "textarea"
    | "select"
    | "checkbox"
    | "custom";
  /** Placeholder text */
  placeholder?: string;
  /** Helper description text */
  description?: string;
  /** Select options (for type: "select") */
  options?: SelectOption[];
  /** Dynamic options loader (async, for type: "select") */
  optionsLoader?: () => SelectOption[];
  /** Grid column span (1 or 2, default 1) — used in a 2-column grid */
  colSpan?: 1 | 2;
  /** Whether field is required (visual only, actual validation is in zod) */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Custom render function (for type: "custom") */
  render?: (form: UseFormReturn<any>) => React.ReactNode;
  /** Min value for number inputs */
  min?: number;
  /** Max value for number inputs */
  max?: number;
  /** Step for number inputs */
  step?: number;
  /** Number of rows for textarea */
  rows?: number;
  /** Conditional visibility */
  visible?: (values: any) => boolean;
}

// ─── Component ────────────────────────────────────────────────

interface DynamicFormFieldsProps {
  form: UseFormReturn<any>;
  fields: FieldConfig[];
  /** Number of columns (1 or 2, default 2) */
  columns?: 1 | 2;
}

export function DynamicFormFields({
  form,
  fields,
  columns = 2,
}: DynamicFormFieldsProps) {
  const values = form.watch();

  const visibleFields = fields.filter(
    (f) => !f.visible || f.visible(values)
  );

  return (
    <div
      className={`grid gap-4 ${
        columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {visibleFields.map((field) => {
        const span = field.colSpan === 2 ? "sm:col-span-2" : "";

        // Custom render
        if (field.type === "custom" && field.render) {
          return (
            <div key={field.name} className={span}>
              {field.render(form)}
            </div>
          );
        }

        // Checkbox
        if (field.type === "checkbox") {
          return (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem
                  className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${span}`}
                >
                  <FormControl>
                    <Checkbox
                      checked={formField.value}
                      onCheckedChange={formField.onChange}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{field.label}</FormLabel>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }

        // Select
        if (field.type === "select") {
          const opts = field.optionsLoader
            ? field.optionsLoader()
            : field.options || [];

          return (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem className={span}>
                  <FormLabel>
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </FormLabel>
                  <Select
                    value={formField.value || ""}
                    onValueChange={formField.onChange}
                    disabled={field.disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={field.placeholder || `Sélectionner...`}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {opts.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }

        // Textarea
        if (field.type === "textarea") {
          return (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem className={span}>
                  <FormLabel>
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={field.placeholder}
                      rows={field.rows || 3}
                      disabled={field.disabled}
                      {...formField}
                    />
                  </FormControl>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }

        // Default: Input (text, number, email, password, date, time, datetime-local)
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className={span}>
                <FormLabel>
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    {...formField}
                    value={formField.value ?? ""}
                    onChange={(e) => {
                      const val =
                        field.type === "number"
                          ? e.target.value === ""
                            ? ""
                            : Number(e.target.value)
                          : e.target.value;
                      formField.onChange(val);
                    }}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
}
