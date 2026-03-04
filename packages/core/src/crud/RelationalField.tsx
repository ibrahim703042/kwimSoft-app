import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
} from "@kwim/shared-ui";
import { createEntityApi, ServiceName } from "./createModule";

export interface RelationalFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  service: ServiceName;
  endpoint: string;
  displayField?: string;
  valueField?: string;
  placeholder?: string;
  required?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export function RelationalField({
  form,
  name,
  label,
  service,
  endpoint,
  displayField = "name",
  valueField = "_id",
  placeholder = "Sélectionner...",
  required = false,
  searchable = false,
  disabled = false,
  className,
}: RelationalFieldProps) {
  const [search, setSearch] = useState("");

  const api = createEntityApi(service, endpoint);

  const { data: responseData, isLoading } = useQuery({
    queryKey: [`${service}${endpoint}`, search],
    queryFn: () => api.list(searchable && search ? { search } : undefined),
  });

  const rawData = responseData?.data;
  const options = Array.isArray(rawData) 
    ? rawData 
    : (rawData as any)?.content || [];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
            disabled={disabled || isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {searchable && (
                <div className="p-2">
                  <Input
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8"
                  />
                </div>
              )}
              {options.map((opt: any) => (
                <SelectItem key={opt[valueField]} value={opt[valueField]}>
                  {opt[displayField]}
                </SelectItem>
              ))}
              {options.length === 0 && (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  {isLoading ? "Chargement..." : "Aucun résultat"}
                </div>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
