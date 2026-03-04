/**
 * PayrollSettingPage - Payroll configuration (pay frequency, pay day, currency, tax)
 */
import { useEffect } from "react";
import { Settings } from "lucide-react";
import { Button, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@kwim/shared-ui";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { settingsApi } from "../../api/hr.api";

interface PayrollFormValues {
  payFrequency: string;
  payDay: number;
  currency: string;
  autoCalculateTax: boolean;
  taxRate: number;
  socialSecurityRate: number;
}

const PAY_FREQUENCIES = [
  { value: "weekly", label: "Hebdomadaire" },
  { value: "biweekly", label: "Bi-hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
];

const CURRENCIES = [
  { value: "CDF", label: "CDF" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const DEFAULT_VALUES: PayrollFormValues = {
  payFrequency: "monthly",
  payDay: 25,
  currency: "CDF",
  autoCalculateTax: true,
  taxRate: 0,
  socialSecurityRate: 0,
};

export default function PayrollSettingPage() {
  const qc = useQueryClient();
  const { data: settingsRes, isLoading } = useQuery({
    queryKey: ["settings-default"],
    queryFn: async () => (await settingsApi.getDefault()).data,
  });
  const settings = settingsRes?.data;
  const settingsId = settings?._id;

  const form = useForm<PayrollFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (settings?.payroll) {
      const p = settings.payroll as Record<string, unknown>;
      form.reset({
        payFrequency: (p.payFrequency as string) ?? DEFAULT_VALUES.payFrequency,
        payDay: (p.payDay as number) ?? DEFAULT_VALUES.payDay,
        currency: (p.currency as string) ?? DEFAULT_VALUES.currency,
        autoCalculateTax: (p.autoCalculateTax as boolean) ?? DEFAULT_VALUES.autoCalculateTax,
        taxRate: (p.taxRate as number) ?? DEFAULT_VALUES.taxRate,
        socialSecurityRate: (p.socialSecurityRate as number) ?? DEFAULT_VALUES.socialSecurityRate,
      });
    }
  }, [settings, form]);

  const mutation = useMutation({
    mutationFn: async (values: PayrollFormValues) => {
      if (!settingsId) throw new Error("Paramètres non chargés");
      return settingsApi.update(settingsId, {
        payroll: {
          payFrequency: values.payFrequency,
          payDay: values.payDay,
          currency: values.currency,
          autoCalculateTax: values.autoCalculateTax,
          taxRate: values.taxRate,
          socialSecurityRate: values.socialSecurityRate,
        },
      });
    },
    onSuccess: () => {
      Swal.fire("Enregistré", "Paramètres de paie mis à jour.", "success");
      qc.invalidateQueries({ queryKey: ["settings-default"] });
    },
    onError: (e: unknown & { response?: { data?: { message?: string } } }) => {
      Swal.fire("Erreur", e.response?.data?.message ?? "Impossible d'enregistrer.", "error");
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres de paie
        </h2>
        <p className="text-sm text-muted-foreground">
          Fréquence, jour de paie, devise et règles fiscales
        </p>
      </div>
      <form onSubmit={onSubmit} className="rounded-lg border bg-white dark:bg-gray-800 p-6 max-w-2xl">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fréquence de paie</Label>
              <Select
                value={form.watch("payFrequency")}
                onValueChange={(v) => form.setValue("payFrequency", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAY_FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Jour de paie (du mois)</Label>
              <Input
                type="number"
                min={1}
                max={31}
                {...form.register("payDay", { valueAsNumber: true })}
              />
              {form.formState.errors.payDay && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.payDay.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Devise</Label>
              <Select
                value={form.watch("currency")}
                onValueChange={(v) => form.setValue("currency", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Taux d'imposition (%)</Label>
              <Input
                type="number"
                min={0}
                step={0.1}
                {...form.register("taxRate", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cotisation sociale (%)</Label>
              <Input
                type="number"
                min={0}
                step={0.1}
                {...form.register("socialSecurityRate", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>
        <Button type="submit" className="mt-4" disabled={mutation.isPending}>
          {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </div>
  );
}
