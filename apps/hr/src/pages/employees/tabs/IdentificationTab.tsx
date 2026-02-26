import { UseFormReturn } from "react-hook-form";
import { Input, FormField, FormItem, FormLabel, FormControl } from "@kwim/shared-ui";
import type { EmployeeFormValues } from "../employee.schema";

export function IdentificationTab({ form }: { form: UseFormReturn<EmployeeFormValues> }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Ces identifiants peuvent être utilisés sur la carte employé (QR / code-barres) et dans le
        journal des présences (biométrique, WiFi, IP).
      </p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="biometricId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID biométrique</FormLabel>
              <FormControl>
                <Input placeholder="ex: empreinte / badge" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wifiMac"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MAC WiFi</FormLabel>
              <FormControl>
                <Input placeholder="ex: 98:ba:5f:c8:74:d3" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deviceId"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>ID appareil</FormLabel>
              <FormControl>
                <Input placeholder="ex: appareil / IP pour suivi" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
