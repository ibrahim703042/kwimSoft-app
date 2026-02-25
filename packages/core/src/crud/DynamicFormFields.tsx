/**
 * DynamicFormFields — Config-driven form field renderer
 */
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Input,
  Textarea,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kwim/shared-ui";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
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
  placeholder?: string;
  description?: string;
  options?: SelectOption[];
  optionsLoader?: () => SelectOption[];
  colSpan?: 1 | 2;
  required?: boolean;
  disabled?: boolean;
  render?: (form: UseFormReturn<any>) => React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  visible?: (values: any) => boolean;
}

interface DynamicFormFieldsProps {
  form: UseFormReturn<any>;
  fields: FieldConfig[];
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

        if (field.type === "custom" && field.render) {
          return (
            <div key={field.name} className={span}>
              {field.render(form)}
            </div>
          );
        }

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
