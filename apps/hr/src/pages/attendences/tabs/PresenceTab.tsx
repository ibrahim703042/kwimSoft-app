import { UseFormReturn } from "react-hook-form";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@kwim/shared-ui";
import type { AttendanceFormValues } from "../attendance.schema";

const STATUS_OPTIONS = [
  { value: "present", label: "Présent" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "En retard" },
  { value: "half_day", label: "Demi-journée" },
  { value: "remote", label: "Télétravail" },
];

const ATTENDANCE_TYPE_OPTIONS = [
  { value: "manual", label: "Manuel" },
  { value: "biometric", label: "Biométrique" },
  { value: "wifi", label: "WiFi" },
  { value: "qr", label: "QR Code" },
  { value: "ip", label: "IP" },
];

interface PresenceTabProps {
  form: UseFormReturn<AttendanceFormValues>;
  employees: { _id: string; firstName: string; lastName: string }[];
}

export function PresenceTab({ form, employees }: PresenceTabProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="employee"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Employé</FormLabel>
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e._id} value={e._id}>
                    {e.firstName} {e.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Statut</FormLabel>
            <Select value={field.value || "present"} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="attendanceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type (trace)</FormLabel>
            <Select value={field.value || "manual"} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ATTENDANCE_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="identifier"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Identifiant (MAC / IP / appareil)</FormLabel>
            <FormControl>
              <Input
                placeholder="ex: 98:ba:5f:c8:74:d3 ou adresse IP"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
