/**
 * RelationalField — Odoo-like many2one / relational field
 *
 * Features:
 * - Searchable dropdown showing related records
 * - "Créer" button to create new record inline
 * - "Voir" button to open existing record detail
 * - Debounced search with API call
 * - Works with react-hook-form via FormField
 *
 * Usage in FieldConfig:
 * {
 *   name: "warehouse",
 *   label: "Entrepôt",
 *   type: "custom",
 *   render: (form) => (
 *     <RelationalField
 *       form={form}
 *       name="warehouse"
 *       label="Entrepôt"
 *       service="stock"
 *       endpoint="/warehouse"
 *       displayField="name"
 *       searchFields={["name", "code"]}
 *       required
 *       createFields={[...]}        // optional: form fields for inline create
 *       createSchema={z.object({})} // optional: zod schema for create
 *     />
 *   ),
 * }
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Search, Plus, ExternalLink, X, Check, Loader2 } from "lucide-react";
import { createEntityApi, ServiceName } from "./createModule";
import { DynamicFormFields, FieldConfig } from "./DynamicFormFields";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

// ─── Types ────────────────────────────────────────────────────

interface RelationalFieldProps {
  /** Parent form (react-hook-form) */
  form: UseFormReturn<any>;
  /** Field name in the parent form */
  name: string;
  /** Display label */
  label: string;
  /** API service name */
  service: ServiceName;
  /** API endpoint for the related entity */
  endpoint: string;
  /** Which field to display from the related record (e.g. "name") */
  displayField: string;
  /** Optional secondary display field */
  secondaryField?: string;
  /** Fields to search in the API */
  searchFields?: string[];
  /** Is this field required? */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Form fields for inline create dialog */
  createFields?: FieldConfig[];
  /** Zod schema for inline create */
  createSchema?: z.ZodSchema;
  /** Default values for create form */
  createDefaults?: Record<string, any>;
  /** Title for create dialog */
  createTitle?: string;
}

// ─── Component ────────────────────────────────────────────────

export function RelationalField({
  form,
  name,
  label,
  service,
  endpoint,
  displayField,
  secondaryField,
  searchFields = ["name"],
  required = false,
  placeholder = "Rechercher...",
  createFields,
  createSchema,
  createDefaults = {},
  createTitle,
}: RelationalFieldProps) {
  const api = createEntityApi(service, endpoint);
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedDisplay, setSelectedDisplay] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Current value from form
  const currentValue = form.watch(name);

  // Fetch options on search
  const { data: response, isLoading } = useQuery({
    queryKey: [`${name}-relational`, endpoint, search],
    queryFn: () => api.list({ search }),
    enabled: open,
    staleTime: 10000,
  });

  const options = response?.data?.content || response?.data || [];

  // Resolve display name when value is set (e.g. on edit)
  useEffect(() => {
    if (currentValue && typeof currentValue === "string" && !selectedDisplay) {
      // Try to fetch the record to get display name
      api.get(currentValue).then((res: any) => {
        const record = res?.data?.data || res?.data || {};
        const display = record[displayField] || "";
        const secondary = secondaryField ? record[secondaryField] : "";
        setSelectedDisplay(secondary ? `${display} (${secondary})` : display);
      }).catch(() => {
        setSelectedDisplay(currentValue);
      });
    }
  }, [currentValue]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (record: any) => {
      const id = record._id || record.id;
      const display = record[displayField] || "";
      const secondary = secondaryField ? record[secondaryField] : "";
      form.setValue(name, id, { shouldValidate: true });
      setSelectedDisplay(secondary ? `${display} (${secondary})` : display);
      setOpen(false);
      setSearch("");
    },
    [form, name, displayField, secondaryField]
  );

  const handleClear = () => {
    form.setValue(name, "", { shouldValidate: true });
    setSelectedDisplay("");
    setSearch("");
  };

  // ── Create form ───────────────────────────────────────────
  const createForm = useForm({
    resolver: createSchema ? zodResolver(createSchema) : undefined,
    defaultValues: createDefaults,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.create(data),
    onSuccess: (res: any) => {
      const record = res?.data?.data || res?.data || {};
      handleSelect(record);
      setCreateOpen(false);
      createForm.reset(createDefaults);
      qc.invalidateQueries({ queryKey: [`${name}-relational`] });
      Swal.fire("Succès!", "Enregistrement créé.", "success");
    },
    onError: (err: any) => {
      Swal.fire(
        "Erreur!",
        err.response?.data?.message || "Erreur lors de la création.",
        "error"
      );
    },
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div ref={dropdownRef} className="relative">
              {/* Selected value display or search input */}
              {selectedDisplay && !open ? (
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background">
                  <span className="flex-1 text-sm truncate">
                    {selectedDisplay}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(true);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Search size={14} />
                  </button>
                  {currentValue && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClear();
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setOpen(true)}
                    className="pl-9 pr-8"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* Dropdown */}
              {open && (
                <div className="absolute z-50 mt-1 w-full bg-popover border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Chargement...</span>
                    </div>
                  ) : options.length === 0 ? (
                    <div className="py-3 px-3 text-center text-sm text-muted-foreground">
                      Aucun résultat trouvé.
                    </div>
                  ) : (
                    <ul className="py-1">
                      {options.map((record: any) => {
                        const id = record._id || record.id;
                        const display = record[displayField] || id;
                        const secondary = secondaryField
                          ? record[secondaryField]
                          : null;
                        const isSelected = currentValue === id;

                        return (
                          <li
                            key={id}
                            onClick={() => handleSelect(record)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors",
                              isSelected
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            )}
                          >
                            {isSelected && <Check size={14} />}
                            <span className="flex-1 truncate">
                              {display}
                              {secondary && (
                                <span className="text-muted-foreground ml-1">
                                  ({secondary})
                                </span>
                              )}
                            </span>
                            <ExternalLink
                              size={12}
                              className="text-muted-foreground opacity-0 group-hover:opacity-100"
                            />
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* Create new */}
                  {createFields && (
                    <div className="border-t px-2 py-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-primary"
                        onClick={() => {
                          setCreateOpen(true);
                          setOpen(false);
                        }}
                      >
                        <Plus size={14} className="mr-2" />
                        Créer nouveau
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />

          {/* Inline Create Dialog */}
          {createFields && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {createTitle || `Nouveau ${label}`}
                  </DialogTitle>
                </DialogHeader>
                <Form {...createForm}>
                  <form
                    onSubmit={createForm.handleSubmit((data) =>
                      createMutation.mutateAsync(data)
                    )}
                    className="space-y-4"
                  >
                    <DynamicFormFields
                      form={createForm}
                      fields={createFields}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCreateOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending
                          ? "Création..."
                          : "Créer"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </FormItem>
      )}
    />
  );
}
