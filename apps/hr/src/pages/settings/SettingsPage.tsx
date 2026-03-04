/**
 * SettingsPage - HR System Settings
 */
import { useState } from "react";
import {
  Button,
  Label,
  Input,
  Checkbox,
} from "@kwim/shared-ui";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { settingsApi } from "../../api/hr.api";
import { Save, Clock, Calendar, Wallet, UserCheck } from "lucide-react";

interface SettingsFormValues {
  workingDays: string[];
  defaultStartTime: string;
  defaultEndTime: string;
  hoursPerDay: number;
  hoursPerWeek: number;
  annualLeaveDefault: number;
  sickLeaveDefault: number;
  carryOverAllowed: boolean;
  maxCarryOverDays: number;
  payFrequency: string;
  payDay: number;
  currency: string;
  autoCalculateTax: boolean;
  taxRate: number;
  lateThresholdMinutes: number;
  earlyLeaveThresholdMinutes: number;
  requireLocationTracking: boolean;
  defaultLanguage: string;
  dateFormat: string;
  timeFormat: string;
  sendEmailNotifications: boolean;
  sendSmsNotifications: boolean;
}

const weekdays = [
  { value: "Monday", label: "Lundi" },
  { value: "Tuesday", label: "Mardi" },
  { value: "Wednesday", label: "Mercredi" },
  { value: "Thursday", label: "Jeudi" },
  { value: "Friday", label: "Vendredi" },
  { value: "Saturday", label: "Samedi" },
  { value: "Sunday", label: "Dimanche" },
];

const INITIAL: SettingsFormValues = {
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  defaultStartTime: "09:00",
  defaultEndTime: "18:00",
  hoursPerDay: 8,
  hoursPerWeek: 40,
  annualLeaveDefault: 20,
  sickLeaveDefault: 10,
  carryOverAllowed: true,
  maxCarryOverDays: 5,
  payFrequency: "monthly",
  payDay: 25,
  currency: "USD",
  autoCalculateTax: true,
  taxRate: 15,
  lateThresholdMinutes: 15,
  earlyLeaveThresholdMinutes: 15,
  requireLocationTracking: false,
  defaultLanguage: "fr",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm",
  sendEmailNotifications: true,
  sendSmsNotifications: false,
};

export default function SettingsPage() {
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["settings-default"],
    queryFn: async () => {
      const res = await settingsApi.getAll();
      const settings = res.data?.data?.[0] || res.data?.content?.[0];
      if (settings) {
        setSettingsId(settings._id);
      }
      return settings;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SettingsFormValues) => {
      const payload = {
        workweek: {
          workingDays: values.workingDays,
          defaultStartTime: values.defaultStartTime,
          defaultEndTime: values.defaultEndTime,
          hoursPerDay: values.hoursPerDay,
          hoursPerWeek: values.hoursPerWeek,
        },
        leave: {
          annualLeaveDefault: values.annualLeaveDefault,
          sickLeaveDefault: values.sickLeaveDefault,
          carryOverAllowed: values.carryOverAllowed,
          maxCarryOverDays: values.maxCarryOverDays,
        },
        payroll: {
          payFrequency: values.payFrequency,
          payDay: values.payDay,
          currency: values.currency,
          autoCalculateTax: values.autoCalculateTax,
          taxRate: values.taxRate,
        },
        attendance: {
          lateThresholdMinutes: values.lateThresholdMinutes,
          earlyLeaveThresholdMinutes: values.earlyLeaveThresholdMinutes,
          requireLocationTracking: values.requireLocationTracking,
        },
        defaultLanguage: values.defaultLanguage,
        dateFormat: values.dateFormat,
        timeFormat: values.timeFormat,
        sendEmailNotifications: values.sendEmailNotifications,
        sendSmsNotifications: values.sendSmsNotifications,
      };

      return settingsId
        ? await settingsApi.update(settingsId, payload)
        : await settingsApi.create(payload);
    },
    onSuccess: () => {
      Swal.fire("Succès!", "Paramètres enregistrés avec succès.", "success");
      qc.invalidateQueries({ queryKey: ["settings-default"] });
    },
    onError: (e: any) =>
      Swal.fire(
        "Erreur!",
        e.response?.data?.message || "Une erreur est survenue.",
        "error"
      ),
  });

  const formik = useFormik<SettingsFormValues>({
    initialValues: settingsData
      ? {
          workingDays: settingsData.workweek?.workingDays || INITIAL.workingDays,
          defaultStartTime: settingsData.workweek?.defaultStartTime || INITIAL.defaultStartTime,
          defaultEndTime: settingsData.workweek?.defaultEndTime || INITIAL.defaultEndTime,
          hoursPerDay: settingsData.workweek?.hoursPerDay || INITIAL.hoursPerDay,
          hoursPerWeek: settingsData.workweek?.hoursPerWeek || INITIAL.hoursPerWeek,
          annualLeaveDefault: settingsData.leave?.annualLeaveDefault || INITIAL.annualLeaveDefault,
          sickLeaveDefault: settingsData.leave?.sickLeaveDefault || INITIAL.sickLeaveDefault,
          carryOverAllowed: settingsData.leave?.carryOverAllowed ?? INITIAL.carryOverAllowed,
          maxCarryOverDays: settingsData.leave?.maxCarryOverDays || INITIAL.maxCarryOverDays,
          payFrequency: settingsData.payroll?.payFrequency || INITIAL.payFrequency,
          payDay: settingsData.payroll?.payDay || INITIAL.payDay,
          currency: settingsData.payroll?.currency || INITIAL.currency,
          autoCalculateTax: settingsData.payroll?.autoCalculateTax ?? INITIAL.autoCalculateTax,
          taxRate: settingsData.payroll?.taxRate || INITIAL.taxRate,
          lateThresholdMinutes: settingsData.attendance?.lateThresholdMinutes || INITIAL.lateThresholdMinutes,
          earlyLeaveThresholdMinutes: settingsData.attendance?.earlyLeaveThresholdMinutes || INITIAL.earlyLeaveThresholdMinutes,
          requireLocationTracking: settingsData.attendance?.requireLocationTracking ?? INITIAL.requireLocationTracking,
          defaultLanguage: settingsData.defaultLanguage || INITIAL.defaultLanguage,
          dateFormat: settingsData.dateFormat || INITIAL.dateFormat,
          timeFormat: settingsData.timeFormat || INITIAL.timeFormat,
          sendEmailNotifications: settingsData.sendEmailNotifications ?? INITIAL.sendEmailNotifications,
          sendSmsNotifications: settingsData.sendSmsNotifications ?? INITIAL.sendSmsNotifications,
        }
      : INITIAL,
    enableReinitialize: true,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  const toggleWorkingDay = (day: string) => {
    const days = formik.values.workingDays;
    if (days.includes(day)) {
      formik.setFieldValue(
        "workingDays",
        days.filter((d) => d !== day)
      );
    } else {
      formik.setFieldValue("workingDays", [...days, day]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Paramètres</h2>
          <p className="text-sm text-muted-foreground">
            Configurer les paramètres du système RH
          </p>
        </div>
        <Button
          onClick={() => formik.handleSubmit()}
          disabled={mutation.isPending}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <div className="mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5" />
              Semaine de travail
            </h3>
            <p className="text-sm text-muted-foreground">
              Définir les jours et heures de travail par défaut
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Jours de travail</Label>
              <div className="flex flex-wrap gap-2">
                {weekdays.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={
                      formik.values.workingDays.includes(day.value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleWorkingDay(day.value)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Heure de début</Label>
                <Input
                  name="defaultStartTime"
                  type="time"
                  value={formik.values.defaultStartTime}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <Label>Heure de fin</Label>
                <Input
                  name="defaultEndTime"
                  type="time"
                  value={formik.values.defaultEndTime}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <Label>Heures/jour</Label>
                <Input
                  name="hoursPerDay"
                  type="number"
                  value={formik.values.hoursPerDay}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <Label>Heures/semaine</Label>
                <Input
                  name="hoursPerWeek"
                  type="number"
                  value={formik.values.hoursPerWeek}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <div className="mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5" />
              Congés
            </h3>
            <p className="text-sm text-muted-foreground">
              Configurer les paramètres de congés par défaut
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Congés annuels (jours)</Label>
                <Input
                  name="annualLeaveDefault"
                  type="number"
                  value={formik.values.annualLeaveDefault}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <Label>Congés maladie (jours)</Label>
                <Input
                  name="sickLeaveDefault"
                  type="number"
                  value={formik.values.sickLeaveDefault}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <Label>Max jours reportables</Label>
                <Input
                  name="maxCarryOverDays"
                  type="number"
                  value={formik.values.maxCarryOverDays}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="carryOverAllowed"
                    checked={formik.values.carryOverAllowed}
                    onCheckedChange={(v) =>
                      formik.setFieldValue("carryOverAllowed", v)
                    }
                  />
                  <Label htmlFor="carryOverAllowed">Autoriser le report</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <div className="mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Wallet className="h-5 w-5" />
              Paie
            </h3>
            <p className="text-sm text-muted-foreground">
              Configurer les paramètres de paie
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Jour de paie</Label>
                <Input
                  name="payDay"
                  type="number"
                  min={1}
                  max={31}
                  value={formik.values.payDay}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <Label>Devise</Label>
                <Input
                  name="currency"
                  value={formik.values.currency}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <Label>Taux d'imposition (%)</Label>
                <Input
                  name="taxRate"
                  type="number"
                  value={formik.values.taxRate}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="autoCalculateTax"
                    checked={formik.values.autoCalculateTax}
                    onCheckedChange={(v) =>
                      formik.setFieldValue("autoCalculateTax", v)
                    }
                  />
                  <Label htmlFor="autoCalculateTax">Calcul auto des taxes</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <div className="mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <UserCheck className="h-5 w-5" />
              Présence
            </h3>
            <p className="text-sm text-muted-foreground">
              Configurer les paramètres de présence
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Seuil de retard (min)</Label>
                <Input
                  name="lateThresholdMinutes"
                  type="number"
                  value={formik.values.lateThresholdMinutes}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <Label>Seuil départ anticipé (min)</Label>
                <Input
                  name="earlyLeaveThresholdMinutes"
                  type="number"
                  value={formik.values.earlyLeaveThresholdMinutes}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="requireLocationTracking"
                    checked={formik.values.requireLocationTracking}
                    onCheckedChange={(v) =>
                      formik.setFieldValue("requireLocationTracking", v)
                    }
                  />
                  <Label htmlFor="requireLocationTracking">
                    Suivi de localisation
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Configurer les préférences de notification
            </p>
          </div>
          <div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sendEmailNotifications"
                  checked={formik.values.sendEmailNotifications}
                  onCheckedChange={(v) =>
                    formik.setFieldValue("sendEmailNotifications", v)
                  }
                />
                <Label htmlFor="sendEmailNotifications">
                  Notifications par email
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sendSmsNotifications"
                  checked={formik.values.sendSmsNotifications}
                  onCheckedChange={(v) =>
                    formik.setFieldValue("sendSmsNotifications", v)
                  }
                />
                <Label htmlFor="sendSmsNotifications">Notifications SMS</Label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
